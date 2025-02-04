import { FilterQuery, Query } from "mongoose";

type Range = {
  $gte?: number;
  $lte?: number;
};

export type FilterQueryType = {
  author?: string;
  category?: string;
  inStock?: boolean;
  price?: Range;
};

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this.query?.search) {
      const { search } = this.query;

      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    if (this.query?.filter) {
      const queryObj = JSON.parse(
        decodeURIComponent(this.query.filter as string)
      );

      const obj: any = {};
      if (queryObj.author) {
        obj["author"] = queryObj.author;
      }
      if (queryObj.category) {
        obj["category"] = queryObj.category;
      }

      obj["price"] = {
        $gte: queryObj.price.$gte,
        $lte: queryObj.price.$lte,
      };

      obj["inStock"] = queryObj.inStock;

      this.modelQuery = this.modelQuery.find(obj);
    }

    return this;
  }

  sort() {
    let order = "";
    if (this.query?.sortOrder) {
      order = this.query.sortOrder == "asc" ? "" : "-";
    }
    let sort =
      (this.query?.sortBy as string)?.split(",")?.join(` ${order}`) ||
      "createdAt";
    sort = order + sort;

    this.modelQuery = this.modelQuery?.sort(sort as string);
    return this;
  }
  paginate() {
    if (this.query?.page) {
      const page = Number(this?.query?.page) || 1;
      const limit = Number(this?.query?.limit) || 9;
      const skip = (page - 1) * limit;

      this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    }

    return this;
  }
}

export default QueryBuilder;

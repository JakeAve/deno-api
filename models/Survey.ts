import { ObjectId } from "../deps.ts";
import { surveysCollection } from "../mongo.ts";

interface SurveyConstructorParams {
  _id?: ObjectId;
  creatorId: string;
  title: string;
  description: string;
}

export class Survey {
  public id?: ObjectId;
  public readonly creatorId: string;
  public readonly title: string;
  public readonly description: string;
  constructor({ _id, creatorId, title, description }: SurveyConstructorParams) {
    this.id = _id;
    this.title = title;
    this.description = description;
    this.creatorId = creatorId;
  }

  async create() {
    const { creatorId, title, description } = this;
    const id: ObjectId = await surveysCollection.insertOne({
      creatorId,
      title,
      description,
    });
    this.id = id;
    return this;
  }
}

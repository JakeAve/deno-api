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
  public title: string;
  public description: string;
  constructor({
    _id,
    creatorId = "1",
    title,
    description,
  }: SurveyConstructorParams) {
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

  async delete() {
    const { id } = this;
    if (!id) throw new Error("Survey has no id");
    await surveysCollection.deleteOne({ _id: id });
  }

  static async findById(id: string) {
    if (!ObjectId.isValid(id)) return null;
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) });
    if (!survey) return null;
    return new Survey(survey as SurveyConstructorParams);
  }

  static async findByUser(creatorId: string) {
    const surveys = await surveysCollection.find({ creatorId });
    return surveys.map(
      (survey) => new Survey(survey as SurveyConstructorParams)
    );
  }

  async update({ title = this.title, description = this.title }) {
    const { id } = this;
    if (!id) throw new Error("Survey has no id");
    await surveysCollection.updateOne(
      { _id: id },
      { $set: { title, description } }
    );
    this.title = title;
    this.description = description;
    return this;
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
    };
  }
}

import { ObjectId } from "../deps.ts";
import { usersCollection } from "../mongo.ts";

export enum UserErrorCodes {
  CREATE_USER_DUPLICATE_EMAIL = "User 1",
}

interface UserConstructorParams {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
}

export class User {
  public id?: ObjectId;
  public readonly email: string;
  public readonly name: string;
  public readonly password: string;

  constructor({ _id, name, email, password }: UserConstructorParams) {
    this.email = email;
    this.id = _id;
    this.name = name;
    this.password = password;
  }

  /**
   *
   * @description Creates a new user in the database, hashes the password and throws an error if the email is already registered
   * @returns Promise<void>
   * @throws UserErrorCodes.CREATE_USER_DUPLICATE_EMAIL
   */
  async create() {
    const userAlreadyExists = await User.findOne({ email: this.email });
    if (userAlreadyExists)
      throw new Error(
        `${UserErrorCodes.CREATE_USER_DUPLICATE_EMAIL} Email already exists`
      );
    const { email, name, password } = this;
    const id: ObjectId = await usersCollection.insertOne({
      email,
      name,
      password,
    });
    this.id = id;
    return this;
  }

  static async findOne(params: object) {
    const user = await usersCollection.findOne(params);
    if (!user) return null;
    return new User(user as unknown as UserConstructorParams);
  }

  toObject() {
    return {
      id: this.id?.toString(),
      name: this.name,
      email: this.email,
    };
  }
}

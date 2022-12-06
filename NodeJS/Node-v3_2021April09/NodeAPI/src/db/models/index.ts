import { BuildOptions, Model } from "sequelize";

interface MyModel extends Model {
  readonly id: number;
}

type MyModelStatic = typeof Model & { new (values?: object, options?: BuildOptions): MyModel };

export default MyModelStatic;

import { Permit } from "../generated/graphql";

interface UpdatablePermit extends Permit {
  time?: number;
}

export default UpdatablePermit;

import {ResourceTag} from "../../../shared/services/resource.service";

export interface Link {
  linkId: string;
  name: string;
  link: string;
  tags: ResourceTag[]
}

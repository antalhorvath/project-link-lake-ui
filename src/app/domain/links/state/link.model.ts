import {ResourceTag} from "../../../shared/models/tag.model";

export interface Link {
  linkId: string;
  name: string;
  link: string;
  tags: ResourceTag[]
}

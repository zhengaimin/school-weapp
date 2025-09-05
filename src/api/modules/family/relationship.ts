import type { Family } from '@/api/interface/modules/family'

import { API } from '@/api/config/servicePort'

import { http } from '@/http'

const FAMILY_RELATIONSHIP_API = {
  RELATIONSHIP_OPTIONS: `${API}/family-contacts/relationship-options`,
}

/** 获取称谓选项 */
export function getRelationshipOptionsApi() {
  return http.get<Family.Relationship.ResGetRelationshipOptionsApi>(
    FAMILY_RELATIONSHIP_API.RELATIONSHIP_OPTIONS,
  )
}

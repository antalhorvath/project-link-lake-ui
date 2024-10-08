import {createActionGroup, emptyProps, props} from '@ngrx/store';

import {Link} from './link.model';

export const LinkPageActions = createActionGroup({
  source: 'Link/Page',
  events: {
    'Load Links': emptyProps(),
    'Add Link': emptyProps(),
    'Edit Link': props<{ link: Link }>(),
    'Save Link': props<{ link: Link }>(),
    'Delete Link': props<{ linkId: string }>()
  }
});

export const LinkApiEvents = createActionGroup({
  source: 'Link/API',
  events: {
    'Load Links Success': props<{ links: Link[] }>(),
    'Load Links Failure': props<{ error: string }>(),
    'Save Link Success': props<{ link: Link }>(),
    'Save Link Failure': props<{ error: string }>(),
    'Delete Link Success': props<{ linkId: string }>(),
    'Delete Link Failure': props<{ error: string }>()
  }
});

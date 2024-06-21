import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Link } from './link.model';

export const LinkPageActions = createActionGroup({
  source: 'Link/Page',
  events: {
    'Load Links': emptyProps(),
    'Add Link': props<{ link: Link }>(),
    'Update Link': props<{ link: Update<Link> }>(),
    'Delete Link': props<{ id: string }>()
  }
});

export const LinkApiEvents = createActionGroup({
  source: 'Link/API',
  events: {
    'Load Links Success': props<{ links: Link[] }>(),
    'Load Links Failure': props<{ error: string }>(),
    'Add Link Success': props<{ link: Link }>(),
    'Add Link Failure': props<{ error: string }>(),
    'Update Link Success': props<{ link: Update<Link> }>(),
    'Update Link Failure': props<{ error: string }>(),
    'Delete Link Success': props<{ in: string }>(),
    'Delete Link Failure': props<{ error: string }>(),
  }
})


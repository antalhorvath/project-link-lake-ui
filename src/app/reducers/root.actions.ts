import {createAction, props} from "@ngrx/store";
import {NotificationModel} from "../shared/models/notification.model";

export const Notification = createAction('Notification', props<{notification: NotificationModel}>());

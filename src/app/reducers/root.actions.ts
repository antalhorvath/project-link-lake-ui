import {createAction, props} from "@ngrx/store";
import {ToastMessageModel} from "../shared/components/toast-message/toast-message.model";

export const ShowToastMessage = createAction('Notification : Show', props<{notification: ToastMessageModel}>());

import { zPollQuestionSchema, zPollSchema } from './models';

export const zEditPollSchema = zPollSchema;
export type EditPollSchema = typeof zEditPollSchema;

export const zEditPollQuestionSchema = zPollQuestionSchema;
export type EditPollQuestionSchema = typeof zEditPollQuestionSchema;

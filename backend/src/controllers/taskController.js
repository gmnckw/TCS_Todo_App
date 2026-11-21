import { sendSuccess } from '../utils/respond.js';

const HTTP_OK = 200;
const HTTP_CREATED = 201;

export function createTaskController(taskService) {
  return {
    list(req, res) {
      sendSuccess(res, HTTP_OK, taskService.list(req.user, req.validated.query));
    },

    create(req, res) {
      sendSuccess(res, HTTP_CREATED, taskService.create(req.user, req.validated.body));
    },

    get(req, res) {
      sendSuccess(res, HTTP_OK, taskService.get(req.user, req.validated.params.id));
    },

    update(req, res) {
      const task = taskService.update(req.user, req.validated.params.id, req.validated.body);
      sendSuccess(res, HTTP_OK, task);
    },

    delete(req, res) {
      taskService.delete(req.user, req.validated.params.id);
      sendSuccess(res, HTTP_OK);
    },
  };
}

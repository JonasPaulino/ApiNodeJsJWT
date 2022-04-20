import { Router } from 'express';
import { Auth } from '../middLewares/auth';
import * as ApiController from '../controllers/apiController';

const router = Router();

router.post('/register', ApiController.register);
router.post('/login',  ApiController.login);
router.post('/Validador',  ApiController.Validador);
//verifica antes de listar se está logado com o Auth.private
router.get('/list', Auth.private, ApiController.list);

export default router;
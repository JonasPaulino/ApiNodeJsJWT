import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) =>{
        let success = false;
       
        //Fazer verificação de Auth
        if(req.headers.authorization){ //se foi enviado algum codigo no authorization herder da requisição então passe.
        
            const [authType, token] = req.headers.authorization.split(' '); //devine o espaço entre a palavra Bearer e o token que está vindo
            if(authType === 'Bearer'){
               
                try { //roda um try pra caso der erro
                   JWT.verify(//verifique se o token enviado na requisição é o mesmo que existe no sistema.
                        token,
                        process.env.JWT_SECRET_KEY as string
                    );

                    success = true;
                } catch (error) {
                    
                }
            }
        }

        if (success){
            next(); //deixa passar
        }else{
            res.status(403);//Não autorizado
            res.json({ error: 'Não autorizado'});
        }

    }
}
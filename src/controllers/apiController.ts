import { Request, Response, NextFunction } from 'express';
import  JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
}

export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await User.findOne({where: { email }});
        if(!hasUser) {
            let newUser = await User.create({ email, password });

            //como logou então gere um tokent
            const token = JWT.sign(
                { id: newUser.id, email: newUser.email},
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' } //o tokent é valido por 2 horas
            );


            res.status(201);
            res.json({ id: newUser.id, token });
            return;
        } else {
            res.json({ error: 'E-mail já existe.' });
            return;
        }
    }

    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({ 
            where: { email, password }
        });

        if(user) {
            //como logou então gere um tokent
            const token = JWT.sign(
                { id: user.id, email: user.email},
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' } //o tokent é valido por 2 horas
            );
            res.json({ status: true, token });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    let users = await User.findAll();
    let list: string[] = [];

    for(let i in users) {
        list.push( users[i].email );
    }

    res.json({ list });
}

export const Validador = async (req: Request, res: Response, next: NextFunction) =>{
        let success = false;
       
        //Fazer verificação de Auth
        if(req.headers.authorization){ //se foi enviado algum codigo no authorization herder da requisição então passe.
        
            const [authType, token] = req.headers.authorization.split(''); 
            console.log(token);
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
            console.log(success);
            res.status(403);//Não autorizado
            res.json({ error: 'Não autorizado'});
        }

    }
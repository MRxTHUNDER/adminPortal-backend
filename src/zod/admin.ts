import {z} from 'zod';

export const adminSignup=z.object({
    name:z.string().max(30),
    email:z.string().max(40),
    password:z.string().max(150),
    adminPassword:z.string().min(1)
})

export const adminSignin=z.object({
    email:z.string().max(40),
    password:z.string().max(150),
    adminPassword:z.string().min(1)
})
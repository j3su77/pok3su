import bcrypt from 'bcryptjs';



interface SeedUser {
    name     : string;
    email    : string;
    password : string;
    role     : 'admin'|'client',
    pokeFavorites : number[]
}



interface SeedData {
    users: SeedUser[];
}





export const initialData: SeedData = {
    users: [
        {
            name: 'jesus vergara',
            email: 'jesus@gmail.com',
            password: bcrypt.hashSync('123456'),
            role: 'admin',
            pokeFavorites: [3, 5]
        },
        {
            name: 'maria Rios',
            email: 'maria@gmail.com',
            password: bcrypt.hashSync('123456'),
            role: 'client',
            pokeFavorites: [7, 90]

        },
    ],
}
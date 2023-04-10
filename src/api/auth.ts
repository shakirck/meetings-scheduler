import app  from '../app';
import authrouter from '../routes/auth/auth';
app.use('/auth', authrouter);
export default authrouter;
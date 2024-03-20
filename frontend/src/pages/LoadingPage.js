import loading from '../assets/loading.gif'
import './styles/LoadingScreen.css'

const LoadingPage = () => {
    return (  
        <div classnName="loading-screen">
            <img src={loading} alt="" />
        </div>
    );
}
 
export default LoadingPage;
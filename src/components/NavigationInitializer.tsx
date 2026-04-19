import { useNavigate } from 'react-router-dom';

const useNavigationInitializer = () => {
    const navigate = useNavigate();

    const navigateToPage = (path: string) => {
        navigate(path);
    };

    return { navigateToPage };
};

export default useNavigationInitializer;
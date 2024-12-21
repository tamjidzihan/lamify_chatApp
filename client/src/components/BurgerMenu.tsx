import { Menu } from 'lucide-react';
import useBurgerMenuStore from '../stateProviders/BurgerMenuStore';

const BurgerMenu = () => {
    const { toggleSidebar } = useBurgerMenuStore();
    return (
        <button
            className="md:hidden top-4 left-4"
            onClick={toggleSidebar}
        >
            <Menu size={24} />
        </button>
    )
}

export default BurgerMenu
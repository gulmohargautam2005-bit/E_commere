import { FaSearch } from "react-icons/fa";
import Button from "@mui/material/Button";
const SearchBox = () => {
    return (
       <div className="Headersearch mb-4">
            <input   className="ml-4"   placeholder="search your product...." type="text" />
            <Button><FaSearch /></Button>
        </div> 
        
    )


}
export default SearchBox;
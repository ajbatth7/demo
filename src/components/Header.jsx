
const Header =()=>(
    <div className="header">
        <div className="header-items">
            <div className="logo">
                <img className="logo-image" src="static/FFlogo.png" alt="FF Logo" />
                <div className="logo-name">Margin Darshboard</div>
            </div>
            <ul className="header-list">
                <li>
                    <button className="header-btn">Summary</button>
                </li>
                <li>
                    <button className="header-btn">Batch-Wise</button>
                </li>
            </ul>

            
        </div>
    </div>
);

export default Header;
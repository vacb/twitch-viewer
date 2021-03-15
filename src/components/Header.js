import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div class="d-flex flex-column flex-md-row align-items-center px-md-4 mb-3 bg-white shadow-sm">
        <h5 class="my-0 mr-md-auto font-weight-normal">
            Random Twitch Things
        </h5>
        <nav className="">
            <ul className="navbar justify-content-end px-0 my-0">
                <li className="nav-item nav-link px-0">
                    <Link to="/">Top Games</Link>
                </li>
                <li className="nav-item nav-link pr-0 pl-3">
                    <Link to="/top-streams">Top Live Games</Link>
                </li>
            </ul>
        </nav>
        </div>
    )
}

export default Header;
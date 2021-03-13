import React, { useState, useEffect } from 'react';
import api from '../api';


const Games = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {        
        const fetchData = async () => {
            const result = await api.get(process.env.GET_GAMES);
            console.log(result.data);
        };
        fetchData();
    });

    return (
        <div>
            <h1>Top Games</h1>
        </div>
    )
}

export default Games;
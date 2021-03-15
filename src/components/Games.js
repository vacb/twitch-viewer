import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import api from '../api';

const request = require('request');

const Games = () => {
    const [games, setGames] = useState([]);

    const getToken = (url, callback) => {
        const options = {
            url: process.env.REACT_APP_GET_TOKEN,
            json: true,
            body: {
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.REACT_APP_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        };
        request.post(options, (err, res, body) => {
            if(err) {
                return console.log(err);
            }
            console.log(`Status: ${res.statusCode}`);
            //console.log(body);
    
            callback(res);
        });
    };
    
    let accessToken = '';
    getToken(process.env.REACT_APP_GET_TOKEN, (res) => {
        //console.log(res.body);
        accessToken = res.body.access_token;
        return accessToken;
    });

    

    useEffect(() => {        
        // const fetchData = async () => {
        //     const result = await api.get(process.env.GET_GAMES);
        //     console.log(result.data);
        // };
        // fetchData();
        
        const getGames = (url, accessToken, callback) => {
            const gameOptions = {
                url: process.env.REACT_APP_GET_GAMES,
                method: 'GET',
                headers: {
                    'Client-ID': process.env.REACT_APP_CLIENT_ID,
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        
            request.get(gameOptions, (err, res, body) => {
                if(err) {
                    return console.log(err);
                }
                console.log(`Status: ${res.statusCode}`);
                
                // console.log('from getGames:');
                // console.log(JSON.parse(body));
               
                let result = JSON.parse(body).data;

                let dataArray = result;
                dataArray.map(game => {
                    let newUrl = game.box_art_url.replace('{width}', '300').replace('{height}', '300');
                    game.box_art_url = newUrl; 
                    return game;
                })
                setGames(dataArray);
            }) 
        }
        setTimeout(() => {
            getGames(process.env.REACT_APP_GET_GAMES, accessToken, (response) => {
                setGames(response.body.data);
            })
        }, 1000);
        
    }, [accessToken]);

    return (
        <div className='container'>
            <div className='row justify-content-center pb-2'>
                <h1>Popular Games</h1>
            </div>
            <div className='row justify-content-center'>
                {games.map(game => (
                    <div className='col-4 pb-3'>
                        <div className='card'>
                            <img className="card-img-top" src={game.box_art_url} alt={game.name}/>
                            <div className = 'card-body'>
                                <h5 className='card-title'>{game.name}</h5>
                                <button className='btn btn-dark'>
                                <Link
                                    className='link'
                                    to={{
                                        pathname: 'game/' + game.name,
                                        state: {
                                            gameID: game.id
                                        }
                                    }}
                                >
                                    {game.name} streams {' '}
                                </Link>
                                </button>
                            </div>
                        
                        
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Games;
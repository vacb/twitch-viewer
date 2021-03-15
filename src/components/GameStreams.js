import React, { useState, useEffect } from 'react';
//import api from '../api';

const request = require('request');

const GameStreams = ({ match, location }) => {
    const [streamData, setStreamData] = useState([]);
    const [viewers, setViewers] = useState(0);

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
        //const fetchData = async () => {
            //const result = await api.get(`${process.env.REACT_APP_GET_STREAMS}${location.state.gameID}`)
            
        const getStreams = (url, accessToken, callback) => {
            const streamOptions = {
                url: `${process.env.REACT_APP_GET_STREAMS}?game_id=${location.state.gameID}`,
                method: 'GET',
                headers: {
                    'Client-ID': process.env.REACT_APP_CLIENT_ID,
                    'Authorization': 'Bearer ' + accessToken
                }
            }
            console.log(location.state.gameID)
            console.log(streamOptions.url)

            request.get(streamOptions, (err, res, body) => {
                if(err) {
                    return console.log(err);
                }
                console.log(`Status: ${res.statusCode}`);
               
                let result = JSON.parse(body).data;
                //let dataArray = result.data.data
                let dataArray = result.map(stream => {
                    let newUrl = stream.thumbnail_url.replace('{width}', '300').replace('{height}', '300');
                    stream.thumbnail_url = newUrl; 
                    return stream;
                })

                let totalViewers = dataArray.reduce((acc, val) => {
                    return acc + val.viewer_count
                },0)
        
            setViewers(totalViewers)
            setStreamData(dataArray)   
            })
        }
        setTimeout(() => {
            getStreams(`${process.env.REACT_APP_GET_STREAMS}${location.state.gameID}`, accessToken, (response) => {
                setStreamData(response.body.data);
            })
        }, 1000);

        //};
        //fetchData();
    }, [accessToken, location.state.gameID]);

    return (
        <div>
            <h1 className='text-center'>{match.params.id} Streams</h1>
            <h3 className='text-center'>
                <strong className='text-primary'>{viewers}</strong> people currently watching {match.params.id}
            </h3>
            <div className='row'>
                {streamData.map(stream => (
                    <div className='col-lg-4 col-md-6 col-sm-12 mt-5'>
                        <div className='card'>
                            <img className='card-img-top' src={stream.thumbnail_url} alt={stream.user_name}/>
                            <div className='card-body'>
                                <h5 className='card-title'>{stream.user_name}</h5>
                                <div className='card-text'>
                                    {stream.viewer_count} live viewers
                                </div>
                                <button className='btn btn-dark'>
                                    <a
                                        className='link'
                                        href={`https://twitch.tv/${stream.user_name}`}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                    >
                                        Watch {stream.user_name}'s channel
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GameStreams;
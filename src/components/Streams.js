import React, { useState, useEffect } from 'react';
//import api from '../api';

const request = require('request');

const Streams = ({ match, location }) => {
    const [channels, setChannels] = useState([]);

    // Getting access token
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
                url: process.env.REACT_APP_GET_STREAMS,
                method: 'GET',
                headers: {
                    'Client-ID': process.env.REACT_APP_CLIENT_ID,
                    'Authorization': 'Bearer ' + accessToken
                }
            }

            request.get(streamOptions, (err, res, body) => {
                if(err) {
                    return console.log(err);
                }
                console.log(`Status: ${res.statusCode}`);
               
                let result = JSON.parse(body).data;

                // Update placeholder values for image size
                let dataArray = result.map(stream => {
                    let newUrl = stream.thumbnail_url.replace('{width}', '300').replace('{height}', '300');
                    stream.thumbnail_url = newUrl; 
                    return stream;
                })

                setChannels(dataArray);
            })
        }    

        setTimeout(() => {
            getStreams(process.env.REACT_APP_GET_STREAMS, accessToken, (response) => {
                setChannels(response.body.data);
            })
        }, 1000);

            //};
            //fetchData();
    }, [accessToken]);

    return (
        <div>
            <h1 className='text-center'>Top Live Streams</h1>
            <div className='row'>
                {channels.map(channel => (
                    <div className='col-lg-4 col-md-6 col-sm-12 mt-5'>
                        <div className='card'>
                            <img className='card-img-top' src={channel.thumbnail_url} alt={channel.user_name}/>
                            <div className='card-body'>
                                <h3 className='card-title'>{channel.user_name}</h3>
                                <h5 className='card-text'>{channel.game_name}</h5>
                                <div className='card-text'>
                                    {channel.viewer_count} live viewers
                                </div>
                                <button className='btn btn-dark'>
                                    <a
                                        className='link'
                                        href={`https://twitch.tv/${channel.user_name}`}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                    >
                                        Watch {channel.user_name}'s channel
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

export default Streams;
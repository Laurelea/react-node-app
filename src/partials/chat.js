import React, {useEffect} from 'react';
import '../css/chat.css';
import io from 'socket.io-client'
import {authorize, setMessage, smthAsync, unauthorize} from "../store/actions";
import {connect} from "react-redux";


const Chat = (props) => {

    useEffect(async () => {
        let socket = await io.connect("https://es-plantit.herokuapp.com/");
        // let socket = await io.connect("http://localhost:8080");
        let message = document.getElementById('message');
        // let username = document.getElementById('username');
        let send_message = document.getElementById('send_message');
        let set_username = document.getElementById('set_username');
        let chatroom = document.getElementById('chatroom');
        let feedback = document.getElementById('feedback');
        // let name = document.getElementById('name');
        let random = Math.floor(Math.random() * (5));
        let alertClasses = ['secondary', 'danger', 'success', 'warning', 'info', 'light'];
        let alertClass = alertClasses[random];

        set_username && set_username.addEventListener('click', () => {
            document.getElementById("input_zone").hidden = false;
            document.getElementById("chatroom").hidden = false;
            document.getElementById("enter_button").hidden = true;
            socket.emit('set_username', {
                username: props.currentUser.userName
            })
        })

        send_message && send_message.addEventListener("click",(event) => {
            socket.emit("new_message", {
                message: message.value,
                className: alertClass
            });
        });

        socket.on ('user_connected', data => {
            feedback.innerHTML =
                "<p>" + 'Total users now: ' + data.number + "</p>" +
                "<p><i>" + data.username + " joined the Chat" + "</i></p>"
            console.log("User connected: ", data.username);
        })

        socket.on("add_message", data => {
            // console.log(data);
            feedback.innerHTML = "";
            message.value = "";
            const div = document.createElement('div');
            div.className = 'alert alert-' + data.className;
            div.innerHTML = '<b>' + data.username + "</b>: " + data.message;
            chatroom.append(div)
        });
        message && message.addEventListener('keypress', (event) => {
                // console.log("Typing!" + event.target.value)
                socket.emit("typing");
            }
        );
        socket.on("typing", data => {
            // console.log("Chat got typing event from server")
            feedback.innerHTML = "<p><i>" + data.username + " is typing ..." + "</i></p>";
            // const div = document.createElement('div');
            // div.className = 'alert alert-' + data.className;
            // div.innerHTML = '<p><i>' + data.username + " prints message..." + "</i></p> ";
            // chatroom.append(div)
        });
        socket.on ("user_disconnected", data => {
            feedback.innerHTML = "<p>" + 'Total users now: ' + data.number + "</p>" +"<p><i>" + data.username + " disconnected" + "</i></p>";
        });

        // socket.on("new", data => {
        //     feedback.innerHTML =
        //         "<p>" + 'Total users now: ' + data.number + "</p>" +
        //         "<p><i>" + data.username + " joined the Chat" + "</i></p>"
        //     console.log("Smth");
        // });
    });
    return (
        <React.Fragment>
        <h3>Чат</h3>
            <section id='enter_button' hidden={false}>
                {/*    <div id="change_username">*/}
                {/*        <input id="username" type="text" />*/}
                <button id="set_username" type="button">Войти в чат</button>
                {/*    </div>*/}
            </section>
            <section id="chatroom" hidden={true}>
                <section id="feedback"></section>
            </section>
            {/*<ul id="messages"></ul>*/}
            <section id="input_zone" hidden={true}>
                <form id="form" action="">
                    <input id="message" autoComplete="off" type="text" className="vertical-align" />
                    <button id="send_message" className="vertical-align" type="button">Send</button>
                </form>
            </section>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        counter: state.counter,
        isAuthenticated: state.isAuthenticated,
        message: state.message,
        currentUser: state.currentUser,
        apiResponse: state.apiResponse,
        pageTitle: state.pageTitle
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        authorize: (userID, userName, userEmail, numberOfPlants) => dispatch(authorize(userID, userName, userEmail, numberOfPlants)),
        unauthorize: () => dispatch(unauthorize()),
        smthAsync: (userID, userName, userEmail, numberOfPlants) => dispatch(smthAsync(userID, userName, userEmail, numberOfPlants)),
        setMessage: message => dispatch(setMessage(message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

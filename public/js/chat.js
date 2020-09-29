const socket = io()

//Elements

const $messageForm = document.querySelector('#form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $location = document.querySelector('#location')
const $messages = document.querySelector('#messages')

//TEmplates

const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


// Options

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autScroll = ()=>{

    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight


    const containerHeight =$messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message)=>{
    console.log(message);
    const html = Mustache.render($messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt:  moment(message.createdAt).format('H:mm')
    })
    
    $messages.insertAdjacentHTML('beforeend', html)
    autScroll()
})

socket.on('locationMessage', (url)=>{
    console.log(url);
    
    const link = Mustache.render($locationTemplate, {
        username: url.username,
        url: url.url, 
        createdAt: moment(url.createdAt).format('H:mm')
    })
    $messages.insertAdjacentHTML('beforeend', link)
    autScroll()
})


socket.on('roomData',({room, users})=>{
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
       if (error) {
           return console.log(error);
       }
       console.log('Message delivered');
    })
})

$location.addEventListener('click', ()=>{
    if (!navigator.geolocation) {
        return alert('Browser don\t support geolocation')
    }

    $location.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        const lat = position.coords.latitude
        const long = position.coords.longitude
        const data = {lat, long}

        socket.emit('location', data, (err)=>{
            if (err) {
                return console.log(err);
            }
            console.log('Location is sent');
            $location.removeAttribute('disabled')
        })
})
})

socket.emit('join', {username, room},(error)=>{
    if (error) {
        alert(error)
        location.href ='/'
    }
})
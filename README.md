# MessagingApp
An online Chat App server that can send and receive messages from a user to another user.

## Functionality

- The ability to go to a website, sign in as a user, and then select another user (Preferably through search, but starting with ID's).  - The messages will be available to view on the screen with the sent messages being on the right and the received messages being on the - left, and the messages will be in date order.
- The user will be able to have multiple conversations that they can switch between.

## Plan of Attack

- Create a NodeJS app with Express, create a User and login structure, with post routes that send messages and routes that receive them.
- Messages will be 'Sent' by adding them to the database and then when the conversation is loaded it will show all messages sent to or from that user.
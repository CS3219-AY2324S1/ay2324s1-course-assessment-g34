How to use the colaboratative editor:
1. Open terminal window, cd to Server directory, run `npm install && npm run server`
2. Open terminal window, cd to Client directory, run `npm install && npm run dev`. Copy the address after `Local: `
3. Open multiple browser tabs/windows on that address. In each browser console, optionally type `test_join("any_id")` with any session ID.
4. Edit in one textbox and see if the change is reflected real-time in other tabs/windows of same session ID.
5. In Browser console, type `test_quit()` to disconnect from service.
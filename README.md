Please load the address for the backend/api first: https://application-api-6yqe.onrender.com/

Then, run the address for frontend: https://application-team-challenge-pzgc-bxjbvvy74-zetao-wus-projects.vercel.app/

I believe that Vercel supports Next.js much more smoothly than Render and Render supports Express much more smoothly than Vercel, thus the two different hosting platforms.

I spent a total of around 26 hours to implement all features.

In terms of tech stack, I attempted to stick with the team's stack, which included TypeScript, React, Next.js, Material-UI and MongoDB.

Overall the project attempte to follow the Figma design as much as possible but with a few tweaks. I have optimized the application in consideration of better accessibility and efficiency for a wider variety of individuals. I tried to keep the changes on the UI as minimal as possible in consideration of respecting the design as much as possible. Below are few functionalities I have made:

 - Search Bar: Instead of the header for the Participant Name, I have changed that part to a search bar, where we can directly search for a participant based on their name. This can more efficiently lookup by name rather than scrolling and finding the correct participant, which can be time consuming given the amount of data.

 - Sorting Mechanism: I have incorporated an popup modal for sorting, which the user can sort by name alphabetically and by ICD Count, both ascending and descending, and also a search functionality where the user can sort by ICD Code. By typing in the ICD Code, the application will sort out users with that specific ICD Code for reference.

 - Translation: For better accessibility, I have added a translation functionality that ranges a wide variety of langauges. I also made sure to not change the participants names with the translation as that can get a bit messy.

 - ARIA-Label: Added ARIA-Labels for each component which can be useful for individuals with assistive technologies, being much more accessible to them.

 - Text-To-Speech in english for ICD Description: Within each participant, I have included a text-to-speech button next to each given ICD description, which can be beneficial for people with some issues visually or related problems.

 - Mobile Responsive: Have adjusted necessary media queries to ensure that the application is responsiveness across all devices, ranging from deskptop to mobile devices.


To run locally, please clone the repo on local device.

After that please run the backend first, so that the participants data can be loaded: 

```bash
cd api
npm install
node index.js
```

Then, we can continue to run the frontend: 

```bash
cd frontend
npm install
npm run dev
```

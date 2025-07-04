class PracticeTestModel {
  constructor() {
    this.practiceData = {};
    this.practiceSessions = {};
  }

  async getPracticeText(categoryId, practiceId) {
    const allPractices = {
      'konsonan-inventory': {
        'KI-001': [
          'I think I thought of a new plan.',
          'Three thousand people attended the event.',
          'Follow the path to find the truth.',
          'He taught us to have faith in ourselves.',
          'Thank you for the thin blanket.',
          'Both of them thought it was true.',
          'The author chose a difficult theme.',
          'Her teeth are as white as pearls.'
        ],
        'KI-002': [
          'They went there together with their father.',
          'Breathe in the fresh air, then breathe out.',
          'This is better than the other one.',
          'Could you soothe the crying baby?',
          'Though it was late, they continued to work.',
          'My brother and I are very close.',
          'The smooth fabric feels soft on the skin.',
          'I would rather stay here with you.'
        ],
        'KI-003': [
          'The red car raced around the track.',
          'Her dress is a very bright color.',
          'The reporter wrote a great story.',
          'We heard a strange sound from the other room.',
          'Try to arrive early for the rehearsal.',
          'The river runs through the forest.',
          'She is a very creative and resourceful person.',
          'The brave warrior returned from the war.'
        ],
        'KI-004': [
          'Please pay attention to the presentation.',
          'Take your time to complete the task.',
          'The key to success is persistence.',
          'I can\'t believe you forgot to call.',
          'The sky is clear and the sun is bright.',
          'She put the pot on the top of the stove.',
          'The cat is playing with a piece of paper.',
          'Keep calm and carry on with your work.'
        ],
        'KI-005': [
          'I live in a large house with a big garden.',
          'She gave him a lovely surprise.',
          'The prize for the winner is a new car.',
          'He has to leave before five o\'clock.',
          'The judge made a very wise decision.',
          'They love to watch the waves at the beach.',
          'The buzz of the bees is a summer sound.',
          'Please close the door when you leave.'
        ]
      },
      'penekanan-kata': {
        'PK-001': [
          'The store will present a lovely present to the winner.',
          'I object to that strange object in the corner.',
          'Please record the new world record.',
          'The rebels will rebel against the unjust law.',
          'His conduct was unacceptable during the project.',
          'You need a permit to permit entry.',
          'The police suspect the main suspect is hiding.',
          'We import a lot of goods from other countries.'
        ],
        'PK-002': [
          'The banana on the sofa is for the monkey.',
          'It was an amazing and memorable occasion.',
          'The problem is about the system we use.',
          'He has taken the necessary steps to succeed.',
          'A beautiful family gathered for the celebration.',
          'The president gave an important speech today.',
          'The photographer took a picture of the mountain.',
          'The computer is a powerful tool for learning.'
        ],
        'PK-003': [
          'We need more information about the situation.',
          'Her decision had a huge impact on the project.',
          'Education is the key to a better future.',
          'The television broadcast the important news.',
          'He got permission to start the construction.',
          'The conclusion of the report was very clear.',
          'Their discussion led to a new solution.',
          'The organization works for social inclusion.'
        ],
        'PK-004': [
          'I need a new toothbrush and some toothpaste.',
          'He bought a ticket at the airport.',
          'She uses a keyboard to type on her laptop.',
          'Let\'s play football in the park this afternoon.',
          'He wears sunglasses when it is sunny.',
          'The bookstore sells many different kinds of books.',
          'The greenhouse is full of beautiful plants.',
          'I read the newspaper every morning.'
        ],
        'PK-005': [
          'The desert is hot and dry, so don\'t desert your friends.',
          'The content of the letter made her feel content.',
          'He had to refuse the offer to dispose of the refuse.',
          'The wind is starting to wind around the house.',
          'The soldier was wounded after the battle.',
          'I produce fresh produce from my garden.',
          'A minute is a very minute amount of time.',
          'They will lead the team to the lead mine.'
        ]
      },
      'skenario-dunia-nyata': {
        'RL-001': [
          'Good morning, my name is John Smith.',
          'It is a pleasure to make your acquaintance.',
          'Allow me to introduce myself.',
          'Hi, I\'m Jane. Nice to meet you.',
          'How do you do? My name is on the list.',
          'Hey there! What\'s your name?',
          'Pleased to meet you, I am the new intern.',
          'Hello, I am here for the 10 AM meeting.'
        ],
        'RL-002': [
          'I would like to make a reservation for two.',
          'Could we see the menu, please?',
          'What are the specials for today?',
          'I will have the steak with a side of fries.',
          'Can I get a glass of water, please?',
          'Everything was delicious, thank you.',
          'Could we have the bill, please?',
          'Is service included in the bill?'
        ],
        'RL-003': [
          'Good morning everyone, let\'s begin the meeting.',
          'The main topic for today is the quarterly budget.',
          'What are your thoughts on this proposal?',
          'I agree with your point, but we should consider the risks.',
          'Let\'s move on to the next item on the agenda.',
          'Does anyone have any questions or comments?',
          'To summarize, we have agreed on the new strategy.',
          'Thank you all for your input. The meeting is adjourned.'
        ],
        'RL-004': [
          'Hello, I would like to schedule an appointment.',
          'I am calling to make an appointment with the doctor.',
          'Is there any availability on Monday morning?',
          'Does 3 PM on Tuesday work for you?',
          'Could you please confirm the time and date?',
          'Thank you for your help. I will see you then.',
          'I need to reschedule my appointment.',
          'Please let me know if there are any cancellations.'
        ],
        'RL-005': [
          'I would like to check in for my flight to London.',
          'Here is my passport and booking confirmation.',
          'Could I have a window seat, please?',
          'How many bags are you checking in?',
          'Where is the boarding gate for this flight?',
          'What time does the boarding begin?',
          'Is my flight on time?',
          'Thank you for your assistance.'
        ]
      },
      'struktur-suku-kata': {
        'SK-001': [
          'The strong wind blew the trees.',
          'She made a big splash in the pool.',
          'We watched a movie on the big screen.',
          'He gave a strange and cryptic reply.',
          'The street was full of people.',
          'Please don\'t scratch the new table.',
          'The spring flowers are beautiful.',
          'He screamed when he saw the spider.'
        ],
        'SK-002': [
          'He runs very fast in the morning.',
          'The final test was quite difficult.',
          'I left my keys on the desk.',
          'May I ask you a personal question?',
          'The risk is too high to take.',
          'She wore a mask to the party.',
          'He built a sand castle on the beach.',
          'The crisp apple was delicious.'
        ],
        'SK-003': [
          'The library has thousands of books.',
          'My neighbor has three cats and two dogs.',
          'She has many tasks to complete today.',
          'My friends are coming over for dinner.',
          'He chose his words very carefully.',
          'The students submitted their reports.',
          'The shops are open until late.',
          'The birds sing in the morning.'
        ],
        'SK-004': [
          'She helped her mother with the chores.',
          'He looked at the painting for a long time.',
          'We watched a great movie last night.',
          'They loved the surprise party.',
          'He cleaned his room before leaving.',
          'The children played in the park all day.',
          'She asked for directions to the station.',
          'He worked hard to achieve his goals.'
        ],
        'SK-005': [
          'He accepts the facts as they are.',
          'The tests cover complex subjects.',
          'She insists on the highest standards.',
          'The list consists of ten items.',
          'He trusts his instincts completely.',
          'The artist creates beautiful sculptures.',
          'The texts were sent to the wrong person.',
          'The posts on the fence are old.'
        ]
      },
      'vokal-inventory': {
        'VI-001': [
          'Did you see the ship leave the sheep?',
          'This is a big green bean.',
          'He will fill the field with water.',
          'Don\'t slip when you are asleep.',
          'The team will win if they keep their grin.',
          'It is a cheap chip.',
          'He hit the heat with a stick.',
          'Sit in your seat, please.'
        ],
        'VI-002': [
          'The car is parked in the large garage.',
          'The star shines bright in the dark night.',
          'How far is the art gallery from the park?',
          'My father started a new business.',
          'The garden party was a charming affair.',
          'He has a large scar on his arm.',
          'The artist painted a beautiful landscape.',
          'We had a calm and relaxing afternoon.'
        ],
        'VI-003': [
          'I like to ride my bike at night.',
          'It is time to turn on the light.',
          'The price is quite high for that size.',
          'She has a bright smile and kind eyes.',
          'Try to find the right answer.',
          'My flight will arrive on time.',
          'The white wine tastes fine.',
          'I will write a line in my diary.'
        ],
        'VI-004': [
          'Look at the full moon in the blue sky.',
          'He put his foot in the new boot.',
          'You should choose a good school.',
          'The food in the cook book looks delicious.',
          'The group stood by the pool.',
          'Who took my new shoes?',
          'The room has a good view of the pool.',
          'Could you pull the tool from the box?'
        ],
        'VI-005': [
          'The early bird catches the worm.',
          'It\'s your turn to serve the guests.',
          'She wants to learn German words.',
          'The girl with the pearl necklace is my sister.',
          'The nurse works on the third floor.',
          'He searched the world for the perfect shirt.',
          'Her work deserves recognition.',
          'The firm has a strict policy.'
        ]
      },
      'irama-bahasa': {
        'IB-001': [
          'What time is the meeting?',
          'Where did you buy that shirt?',
          'Who is the new manager?',
          'Why did you choose this university?',
          'How do you solve this problem?',
          'When is the deadline for the project?',
          'Which one do you prefer?',
          'Whose keys are these on the table?'
        ],
        'IB-002': [
          'Have you finished your homework?',
          'Is it going to rain today?',
          'Do you want to go to the cinema?',
          'Can you help me with this task?',
          'Are they joining us for dinner?',
          'Should I call him back later?',
          'Will you be at the party tonight?',
          'Does this bus go to the city center?'
        ],
        'IB-003': [
          'The quick brown fox jumps over the lazy dog.',
          'She bought a beautiful new dress for the party.',
          'He drives his car very carefully on the highway.',
          'The students are studying for their final exams.',
          'We ate a delicious pizza at the Italian restaurant.',
          'The old library has thousands of interesting books.',
          'My younger sister sings her favorite songs very loudly.',
          'The company launched a successful marketing campaign last year.'
        ],
        'IB-004': [
          'I want to go to the store to buy some bread.',
          'Can you tell me the time if you have a watch?',
          'The cat is sleeping on the mat in the sun.',
          'Lets meet for lunch at twelve on Tuesday.',
          'He walked to the park and sat on a bench.',
          'She read a book while she waited for the train.',
          'They played some games and had a lot of fun.',
          'We need to finish this work before we leave.'
        ],
        'IB-005': [
          'Do you prefer to travel by train or by plane?',
          'Should we watch a movie or play a board game?',
          'Are you going to order the chicken or the fish?',
          'Would you like to sit inside or outside?',
          'Is your favorite season summer or winter?',
          'Do you want to pay with cash or with a credit card?',
          'Should I wear the blue shirt or the red one?',
          'Are we meeting on Monday or on Wednesday?'
        ]
      }
    };

    if (allPractices[categoryId] && allPractices[categoryId][practiceId]) {
      const practiceItems = allPractices[categoryId][practiceId];
      const text = Array.isArray(practiceItems) 
        ? practiceItems[Math.floor(Math.random() * practiceItems.length)]
        : practiceItems;
      // Simpan data practice terakhir yang di-load
      this.practiceData.last = { id: practiceId, text };
      return text;
    }
    console.error(`Practice data not found for ${categoryId}/${practiceId}`);
    return null;
  }

  savePracticeRecording(categoryId, practiceId, recording, score) {
    if (!this.practiceData[categoryId]) this.practiceData[categoryId] = {};
    if (!this.practiceData[categoryId][practiceId]) this.practiceData[categoryId][practiceId] = [];
    this.practiceData[categoryId][practiceId].push({ recording, score });
  }

  savePracticeSession(categoryId, practiceId, recordings, scores, avgScore) {
    if (!this.practiceSessions[categoryId]) this.practiceSessions[categoryId] = {};
    if (!this.practiceSessions[categoryId][practiceId]) this.practiceSessions[categoryId][practiceId] = [];
    this.practiceSessions[categoryId][practiceId].push({
      recordings,
      scores,
      avgScore,
      timestamp: Date.now()
    });
  }
}

export default PracticeTestModel;

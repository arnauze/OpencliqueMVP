export const MOCKED_COFFEE = {
    name: "Blueys Market & Cafe",
    flames: 3,
    medias: [],
    tags: ["Breakfast spot", "Chill Vibe", "Cheap"],
    address: "1814 Berkeley St, Santa Monica",
    is_open: true,
    opening_hours: {
        timeframes: [
          {
            days: [1, 2, 3, 4, 5],
            open: [
              {
                start: "0700",
                end: "2030"
              }
            ],
            segments: []
          },
          {
            days: [6, 7],
            open: [
              {
                start: "0800",
                end: "2030"
              }
            ],
            segments: []
          }
        ]
      },
    website: "https://blueyskitchen.com"
}

export const MOCKED_FOOD = {
    name: "Honey Bird",
    flames: 2,
    medias: [],
    tags: ["Diner place", "Chill Vibe", "Breathtaking view"],
    address: "3201 S Hoover St, Los Angeles",
    is_open: false,
    opening_hours: {
        timeframes: [
          {
            days: [1, 2, 3, 4, 5, 6],
            open: [
              {
                start: "1800",
                end: "+0100"
              }
            ],
            segments: []
          },
          {
            days: [7],
            open: [
            ],
            segments: []
          }
        ]
      },
    website: "https://honeybird.com"
}
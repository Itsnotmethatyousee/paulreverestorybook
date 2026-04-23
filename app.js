const STORAGE_KEY = "lantern-quest-storybook-progress-v3";
const SETTINGS_KEY = "lantern-quest-storybook-settings-v3";
const LEGACY_PROGRESS_KEYS = ["lantern-quest-progress-v2", "lantern-quest-progress-v1"];
const LEGACY_SETTINGS_KEYS = ["lantern-quest-settings-v2", "lantern-quest-settings-v1"];
const KOKORO_JS_URL = "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/+esm";
const KOKORO_MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const CLOUD_WORKER_BASE_URL = "https://paul-revere-murf.alex-8ff.workers.dev";
const OPENAI_TTS_URL = `${CLOUD_WORKER_BASE_URL}/tts`;
const OPENAI_STT_URL = `${CLOUD_WORKER_BASE_URL}/stt`;
const CLOUD_SAVE_URL = `${CLOUD_WORKER_BASE_URL}/save-progress`;
const CLOUD_LOAD_URL = `${CLOUD_WORKER_BASE_URL}/load-progress`;
const OPENAI_TTS_DEFAULTS = {
  voice: "verse",
  model: "gpt-4o-mini-tts",
  instructions: "Speak warmly, clearly, and naturally to a fourth grader who is memorizing poetry. Keep the delivery expressive but calm.",
  response_format: "mp3",
};
const KOKORO_VOICE_LABELS = {
  af_bella: "Bella",
  af_sarah: "Sarah",
  am_fenrir: "Fenrir",
  am_michael: "Michael",
};

const WORD_CONNECTORS = new Set([
  "a", "an", "the", "and", "or", "but", "for", "of", "to", "in", "on", "at", "by", "with", "from", "up",
  "down", "into", "over", "under", "through", "as", "is", "it", "its", "his", "her", "their", "our", "you",
  "your", "my", "me", "he", "she", "they", "them", "that", "this", "these", "those", "be", "been", "were",
  "was", "are", "am", "will", "shall", "would", "could", "should", "all", "now", "then", "who",
]);

const stageDefinitions = [
  {
    stage: 1,
    label: "Stage 1: Power words",
    instruction: "Use the strongest words in the line to remember how it goes.",
  },
  {
    stage: 2,
    label: "Stage 2: Missing words",
    instruction: "Fill the hidden gaps without losing the line's rhythm or wording.",
  },
  {
    stage: 3,
    label: "Stage 3: First letters",
    instruction: "Only the first letters remain. Rebuild the line from the pattern.",
  },
  {
    stage: 4,
    label: "Stage 4: Hidden recall",
    instruction: "The line is hidden now. Say or type it from memory before moving on.",
  },
  {
    stage: 5,
    label: "Stage 5: Prove the line",
    instruction: "One more clean recall so the line feels ready for the recital gate.",
  },
];

const chapterBlueprints = {
  "churchyard-watch": {
    title: "The Churchyard Hush",
    badge: "Churchyard",
    location: "Old North Churchyard",
    scenePrompt: "Walk the moonlit graves first. Before anyone rides, the poem wants you to feel the silence.",
    sceneTag: "churchyard-watch",
    lineStart: 42,
    lineEnd: 46,
    narration: "Below the tower, the churchyard lies still and silent. Longfellow makes the graves feel like a night camp, quiet enough that even the wind seems to be on guard duty.",
    significance: "This matters because the poem starts with stillness. The warning will feel bigger because the night begins so quiet.",
    actions: [
      { id: "inspect-graves", label: "Look among the graves", copy: "Notice the churchyard below.", resultTitle: "The graves make the poem feel still and serious.", resultCopy: "This is not just scenery. The quiet graveyard makes the warning feel weighty, like history is listening.", x: 23, y: 69, w: 128, requires: [] },
      { id: "feel-stillness", label: "Hold the hush", copy: "Feel how still the place is.", resultTitle: "The night goes almost silent.", resultCopy: "Longfellow begins with hush so the coming alarm will feel huge. The calm is part of the drama.", x: 43, y: 59, w: 132, requires: ["inspect-graves"] },
    ],
  },
  "whispering-wind": {
    title: "The Whispering Wind",
    badge: "Night Wind",
    location: "The Yard Beneath the Tower",
    scenePrompt: "Notice the wind like a sneaking messenger. The poem is building suspense before the action starts.",
    sceneTag: "churchyard-watch",
    lineStart: 47,
    lineEnd: 51,
    narration: "Now the night seems alive. The wind creeps from place to place like a soldier checking camp, whispering that all is well even though something important is about to happen.",
    significance: "This matters because the poet turns the wind into a warning mood. The child is meant to feel suspense before anyone rides anywhere.",
    actions: [
      { id: "follow-wind", label: "Follow the night-wind", copy: "Track the whisper through the yard.", resultTitle: "The wind starts acting like a character.", resultCopy: "Instead of plain weather, the poem gives the wind a job. It moves like a guard checking the camp.", x: 30, y: 53, w: 144, requires: [] },
      { id: "hear-all-is-well", label: "Hear 'All is well'", copy: "Catch the whispered words.", resultTitle: "The words feel safe, but the reader knows danger is near.", resultCopy: "That makes the poem tense. It sounds calm on top, but underneath it is preparing for a warning.", x: 49, y: 44, w: 138, requires: ["follow-wind"] },
    ],
  },
  "moonrise-bay": {
    title: "The Bay and the Bridge of Boats",
    badge: "Harbor",
    location: "Boston Harbor",
    scenePrompt: "Look past the graveyard to the water. The poem swings from spooky mood into real danger.",
    sceneTag: "moonrise-bay",
    lineStart: 52,
    lineEnd: 56,
    narration: "The friend's thoughts jump away from the lonely churchyard and out toward the bay. There, a dark shape stretches across the water like a bridge of boats, showing that the British are on the move.",
    significance: "This matters because the poem shifts from spooky feeling to actual danger. The warning is no longer just a mood. It has a real reason.",
    actions: [
      { id: "scan-bay", label: "Look across the bay", copy: "Search the widening water.", resultTitle: "The poem opens outward.", resultCopy: "The child's imagination leaves the small churchyard and suddenly sees the whole harbor. The danger feels bigger now.", x: 52, y: 58, w: 132, requires: [] },
      { id: "trace-boat-bridge", label: "Trace the boats", copy: "Follow the dark line on the tide.", resultTitle: "The bridge of boats reveals the threat.", resultCopy: "This is why the warning matters. The British can cross, so the signal must be seen in time.", x: 19, y: 74, w: 148, requires: ["scan-bay"] },
    ],
  },
  "ride-prep": {
    title: "Paul Revere Gets Ready",
    badge: "North Shore",
    location: "Charlestown Shore",
    scenePrompt: "The ride has not started yet. Watch how preparation becomes part of the courage.",
    sceneTag: "ride-prep",
    lineStart: 57,
    lineEnd: 63,
    narration: "While the friend watches from the tower, Paul Revere waits on the opposite shore. He pats the horse, studies the land, and tightens the saddle because he knows the ride could begin at any second.",
    significance: "This matters because it shows preparation. Courage is not just rushing. It is getting ready before the moment comes.",
    actions: [
      { id: "steady-horse", label: "Steady the horse", copy: "Calm the horse before the ride.", resultTitle: "Paul Revere is ready, not reckless.", resultCopy: "The poem shows him preparing with care. That makes his bravery feel thoughtful, not wild.", x: 58, y: 72, w: 132, requires: [] },
      { id: "tighten-saddle", label: "Tighten the saddle", copy: "Make sure the ride can happen.", resultTitle: "The ride is waiting on one signal.", resultCopy: "Everything is set. The horse, the rider, and the route are ready. Now the tower matters even more.", x: 68, y: 63, w: 138, requires: ["steady-horse"] },
    ],
  },
  "tower-watch": {
    title: "Watch the Belfry",
    badge: "Old North",
    location: "The Belfry Window",
    scenePrompt: "Fix your eyes on the tower. This chapter is about teamwork, patience, and the signal that starts history moving.",
    sceneTag: "lantern-signal",
    lineStart: 64,
    lineEnd: 65,
    narration: "Paul Revere is ready now, but he is still waiting. His eyes stay fixed on the Old North Church tower because the signal will tell him when the warning ride must begin.",
    significance: "This matters because the poem is showing signal, patience, and teamwork. One friend watches. One friend rides. Both jobs matter.",
    actions: [
      { id: "watch-the-tower", label: "Watch the church tower", copy: "Keep your eyes on the belfry.", resultTitle: "The whole ride depends on watching well.", resultCopy: "This moment teaches that great events can depend on patient waiting, not just speed and excitement.", x: 74, y: 55, w: 144, requires: [] },
      { id: "mark-the-signal", label: "Mark the signal place", copy: "Notice where the lantern will shine next.", resultTitle: "The signal spot becomes the heart of the poem.", resultCopy: "Soon the lantern will turn this quiet watching into action. The child should feel that change coming.", x: 79, y: 36, w: 152, requires: ["watch-the-tower"] },
    ],
  },
};

const chapterStoryPages = {
  "opening-call-scene-1": [
    "./content/assets/storybook/01-14/01-14-page-01.png",
    "./content/assets/storybook/01-14/01-14-page-02.png",
    "./content/assets/storybook/01-14/01-14-page-03.png",
    "./content/assets/storybook/01-14/01-14-page-04.png",
  ],
  "opening-call-scene-2": [
    "./content/assets/storybook/15-23/15-23-page-01.png",
    "./content/assets/storybook/15-23/15-23-page-02.png",
    "./content/assets/storybook/15-23/15-23-page-03.png",
    "./content/assets/storybook/15-23/15-23-page-04.png",
  ],
  "gathering-night-scene-1": [
    "./content/assets/storybook/24-30/24-30-page-01.png",
    "./content/assets/storybook/24-30/24-30-page-02.png",
    "./content/assets/storybook/24-30/24-30-page-03.png",
  ],
  "gathering-night-scene-2": [
    "./content/assets/storybook/31-41/31-41-page-01.png",
    "./content/assets/storybook/31-41/31-41-page-02.png",
    "./content/assets/storybook/31-41/31-41-page-03.png",
    "./content/assets/storybook/31-41/31-41-page-04.png",
  ],
  "churchyard-watch": [
    "./content/assets/storybook/42-65/page-01-entering-churchyard.png.png",
    "./content/assets/storybook/42-65/page-02-zoom-into-graves.png.png",
    "./content/assets/storybook/42-65/page-03-look-up-tower.png.png",
  ],
  "whispering-wind": [
    "./content/assets/storybook/42-65/page-04-wind-begins.png.png",
    "./content/assets/storybook/42-65/page-05-whispering-guard.png.png",
  ],
  "moonrise-bay": [
    "./content/assets/storybook/42-65/page-06-harbor-opens.png.png",
    "./content/assets/storybook/42-65/page-07-bridge-of-boats.png.png",
  ],
  "ride-prep": [
    "./content/assets/storybook/42-65/page-08-paul-waits.png.png",
    "./content/assets/storybook/42-65/page-09-hands-on-saddle.png.png",
  ],
  "tower-watch": [
    "./content/assets/storybook/42-65/page-10-back-inside-tower.png.png",
    "./content/assets/storybook/42-65/page-11-belfry-window.png.png",
    "./content/assets/storybook/42-65/page-12-signal-place.png.png",
  ],
  "lantern-flare-chapter-1": [
    "./content/assets/storybook/66-86/66-74-page-01.png",
    "./content/assets/storybook/66-86/66-74-page-02.png",
    "./content/assets/storybook/66-86/66-74-page-03.png",
  ],
  "lantern-flare-chapter-2": [
    "./content/assets/storybook/66-86/75-86-page-01.png",
    "./content/assets/storybook/66-86/75-86-page-02.png",
    "./content/assets/storybook/66-86/75-86-page-03.png",
  ],
  "midnight-ride-chapter-1": [
    "./content/assets/storybook/87-110/87-100-page-01.png",
    "./content/assets/storybook/87-110/87-100-page-02.png",
  ],
  "midnight-ride-chapter-2": [
    "./content/assets/storybook/87-110/87-100-page-03.png",
    "./content/assets/storybook/87-110/87-100-page-04.png",
  ],
  "midnight-ride-chapter-3": [
    "./content/assets/storybook/87-110/101-110-page-01.png",
    "./content/assets/storybook/87-110/101-110-page-02.png",
  ],
  "echo-forevermore-chapter-1": [
    "./content/assets/storybook/110-130/110-130-page-01.png",
    "./content/assets/storybook/110-130/111-118-page-01.png",
    "./content/assets/storybook/110-130/111-118-page-02.png",
  ],
  "echo-forevermore-chapter-2": [
    "./content/assets/storybook/110-130/111-118-page-03.png",
    "./content/assets/storybook/110-130/119-130-page-01.png",
  ],
  "echo-forevermore-chapter-3": [
    "./content/assets/storybook/110-130/119-130-page-02.png",
    "./content/assets/storybook/110-130/119-130-page-03.png",
  ],
  "echo-forevermore-chapter-4": [
    "./content/assets/storybook/110-130/119-130-page-04.png",
  ],
};

const sectionChapterBlueprints = {
  "opening-call": [
    {
      id: "opening-call-scene-1",
      title: "Listen and Make the Plan",
      badge: "Opening",
      sceneTag: "opening-call",
      lineStart: 1,
      lineEnd: 14,
      location: "Moonlit Boston and the Secret Plan",
      scenePrompt: "The poem begins like a storyteller leaning close. First the child should feel invited into a secret nighttime mission.",
      narration: "These opening lines do two jobs at once: they pull the listener in and explain the lantern plan that will matter later.",
      significance: "This matters because the poem is not random description. It is setting the mission, the code, and the reason the night matters.",
      actions: [
        { id: "hear-invitation", label: "Hear the storyteller's call", copy: "Step into the tale as if someone is speaking right to you.", resultTitle: "The poem opens like a legend being passed down.", resultCopy: "Longfellow wants the child to feel welcomed into an important story before the action begins.", x: 24, y: 66, w: 184, requires: [] },
        { id: "lock-the-plan", label: "Lock in the lantern plan", copy: "Notice the one-by-land, two-by-sea signal.", resultTitle: "The secret code becomes the key to the whole poem.", resultCopy: "This is the mission rule everything else depends on later in the night.", x: 71, y: 42, w: 186, requires: ["hear-invitation"] },
      ],
    },
    {
      id: "opening-call-scene-2",
      title: "Across the Water to the Somerset",
      badge: "Harbor",
      sceneTag: "somerset-watch",
      lineStart: 15,
      lineEnd: 23,
      location: "Boston Harbor Under the Moon",
      scenePrompt: "Now the poem leaves the plan and slips onto the water, where the danger in the harbor becomes visible.",
      narration: "The rowboat, the moon, and the huge dark ship all make the night feel secret, quiet, and dangerous at the same time.",
      significance: "This matters because the child can now see why the warning is needed. The harbor is not peaceful scenery. It holds the threat.",
      actions: [
        { id: "cross-water", label: "Cross the moonlit water", copy: "Follow the muffled oar into the bay.", resultTitle: "The poem grows quieter and more secretive.", resultCopy: "The soft boat movement makes the warning feel careful and hidden.", x: 28, y: 72, w: 176, requires: [] },
        { id: "face-somerset", label: "Face the Somerset", copy: "Look at the dark warship waiting in the tide.", resultTitle: "The threat becomes visible in the harbor.", resultCopy: "The huge black ship makes the danger feel real, not imagined.", x: 72, y: 48, w: 176, requires: ["cross-water"] },
      ],
    },
  ],
  "gathering-night": [
    {
      id: "gathering-night-scene-1",
      title: "Watch the Soldiers Gather",
      badge: "Streets",
      sceneTag: "gathering-night",
      lineStart: 24,
      lineEnd: 30,
      location: "Alleys, Streets, and Barrack Door",
      scenePrompt: "The watcher moves through the dark streets and begins to witness the British gathering in secret.",
      narration: "The poem becomes tense and sneaky here. It is all about watching closely and noticing movement before the rest of the town understands what is happening.",
      significance: "This matters because the warning depends on careful observation. Before anyone can act, someone has to notice the threat forming.",
      actions: [
        { id: "shadow-streets", label: "Move through the alleys", copy: "Track the watcher through the dark streets.", resultTitle: "The city becomes part of the suspense.", resultCopy: "Longfellow turns the streets into a maze of listening and watching.", x: 26, y: 67, w: 174, requires: [] },
        { id: "spot-muster", label: "Spot the muster", copy: "See the soldiers gathering by the barrack door.", resultTitle: "The hidden danger starts taking shape.", resultCopy: "The poem shifts from rumor to visible military movement.", x: 72, y: 50, w: 176, requires: ["shadow-streets"] },
      ],
    },
    {
      id: "gathering-night-scene-2",
      title: "Climb into the Old North Tower",
      badge: "Tower",
      sceneTag: "tower-climb",
      lineStart: 31,
      lineEnd: 41,
      location: "Old North Church Tower",
      scenePrompt: "The watcher climbs the tower, disturbs the pigeons, and looks out high above the city and sea.",
      narration: "These lines lift the poem upward. The tower gives the child height, secrecy, and the feeling that a signal could soon change everything.",
      significance: "This matters because the tower is where suspense sharpens. The poem is raising the child into position for the churchyard scene that comes next.",
      actions: [
        { id: "climb-tower", label: "Climb the tower stairs", copy: "Move up through beams, ropes, and shadow.", resultTitle: "The poem rises into the tower.", resultCopy: "The climb adds tension because every step feels secret and important.", x: 35, y: 70, w: 172, requires: [] },
        { id: "look-over-city", label: "Look over the city and sea", copy: "Reach the high view above Boston.", resultTitle: "The tower becomes the last still lookout before the churchyard below.", resultCopy: "From here the child can feel how close the city, harbor, and coming warning all are to each other.", x: 74, y: 38, w: 186, requires: ["climb-tower"] },
      ],
    },
  ],
  "lantern-flare": [
    {
      id: "lantern-flare-chapter-1",
      title: "The Lantern Goes Up",
      badge: "Tower Climb",
      sceneTag: "lantern-signal",
      lineStart: 66,
      lineEnd: 74,
      location: "Inside Old North Church",
      scenePrompt: "The friend has to climb, reach the arch, and ready the lantern before the ride can truly begin.",
      narration: "The poem narrows into the tower again. Everything depends on one person climbing carefully and getting the signal in place.",
      significance: "This matters because courage here looks like quiet precision. The signal only works if the watcher does the careful part right.",
      actions: [
        { id: "climb-belfry", label: "Climb into the belfry", copy: "Move the mission upward into the tower.", resultTitle: "The climb turns waiting into action.", resultCopy: "The story is no longer about watching and wondering. Now someone is doing the exact job that will set the ride in motion.", x: 69, y: 59, w: 160, requires: [] },
        { id: "ready-lantern", label: "Ready the lantern", copy: "Prepare the signal in the dark.", resultTitle: "The signal is almost alive.", resultCopy: "Longfellow makes this feel suspenseful because one small light is about to carry a huge message.", x: 78, y: 37, w: 154, requires: ["climb-belfry"] },
      ],
    },
    {
      id: "lantern-flare-chapter-2",
      title: "The Signal Sends Him Flying",
      badge: "Signal",
      sceneTag: "lantern-signal",
      lineStart: 75,
      lineEnd: 86,
      location: "Harbor to Charlestown Shore",
      scenePrompt: "The lantern finally shines. Now the signal must be seen, understood, and turned into motion.",
      narration: "This is the hinge of the whole poem. The light appears in the tower, Paul sees it, and the waiting changes into movement.",
      significance: "This matters because the poem is teaching how teamwork works across distance. One person shines the signal. Another person turns it into action.",
      actions: [
        { id: "spot-lantern", label: "Spot the lantern light", copy: "Catch the signal in the tower.", resultTitle: "The message becomes visible.", resultCopy: "The warning is no longer hidden in plans and suspense. It becomes a real sign that can be seen across the water.", x: 74, y: 31, w: 160, requires: [] },
        { id: "launch-ride", label: "Turn signal into motion", copy: "Let the rider answer the light.", resultTitle: "The ride begins for real.", resultCopy: "Once Paul sees the lantern, the poem changes from signal-story into ride-story.", x: 25, y: 70, w: 170, requires: ["spot-lantern"] },
      ],
    },
  ],
  "midnight-ride": [
    {
      id: "midnight-ride-chapter-1",
      title: "He Is Already Flying",
      badge: "Road Sparks",
      sceneTag: "ride-prep",
      lineStart: 87,
      lineEnd: 92,
      location: "The Midnight Road",
      scenePrompt: "Do not treat this like another takeoff scene. The ride is already underway and the road is carrying him fast.",
      narration: "Longfellow now gives the poem speed. The horse, the road, and the sparks make the warning feel urgent and physical.",
      significance: "This matters because the rhythm of the poem becomes movement. The child should feel hoofbeats, not just understand them.",
      actions: [
        { id: "feel-speed", label: "Feel the hoofbeat speed", copy: "Notice how fast the road is moving now.", resultTitle: "The poem turns into motion.", resultCopy: "This section teaches memorization through rhythm. The ride itself becomes the beat of the lines.", x: 67, y: 72, w: 170, requires: [] },
        { id: "trace-sparks", label: "Trace the sparks", copy: "Follow the warning rushing outward.", resultTitle: "The warning is racing ahead of dawn.", resultCopy: "The sparks make the ride feel alive, sharp, and impossible to ignore.", x: 41, y: 78, w: 154, requires: ["feel-speed"] },
      ],
    },
    {
      id: "midnight-ride-chapter-2",
      title: "Lexington in the Moonlight",
      badge: "Lexington",
      sceneTag: "lexington-ride",
      lineStart: 93,
      lineEnd: 100,
      location: "Lexington",
      scenePrompt: "The rider reaches a real town. The empty streets and windows make the warning feel eerie before history breaks open.",
      narration: "Now the poem rides into Lexington, where buildings and windows seem to watch the rider as he passes.",
      significance: "This matters because Longfellow uses the town itself almost like a character. Even the windows seem to know something terrible is near.",
      actions: [
        { id: "enter-lexington", label: "Ride into Lexington", copy: "Reach the town under the village clock.", resultTitle: "The warning reaches the town.", resultCopy: "The ride is no longer only a road scene. It is now waking places where people live and gather.", x: 63, y: 56, w: 164, requires: [] },
        { id: "study-windows", label: "Study the empty windows", copy: "Notice the strange stillness of the town.", resultTitle: "The town feels haunted by what is coming.", resultCopy: "The empty windows add suspense. The reader feels that the town is on the edge of a terrible morning.", x: 73, y: 42, w: 176, requires: ["enter-lexington"] },
      ],
    },
    {
      id: "midnight-ride-chapter-3",
      title: "Concord Before Dawn",
      badge: "Concord",
      sceneTag: "concord",
      lineStart: 101,
      lineEnd: 110,
      location: "Concord Bridge and Meadows",
      scenePrompt: "The ride reaches Concord, and the poem begins to soften into dawn even while it foreshadows loss.",
      narration: "Birds, breeze, and meadow light begin to appear. The danger is still there, but now the poem adds sadness and foreshadowing.",
      significance: "This matters because the poem turns from speed toward consequence. The warning has reached people, but history is about to cost real lives.",
      actions: [
        { id: "cross-concord", label: "Reach Concord bridge", copy: "Step into the new place at the edge of dawn.", resultTitle: "The ride arrives where memory will deepen.", resultCopy: "Concord feels different from Lexington because nature is waking too, and the story begins to feel heavier.", x: 48, y: 70, w: 170, requires: [] },
        { id: "notice-foreshadow", label: "Notice the quiet danger", copy: "Feel the sadness hiding under the dawn.", resultTitle: "The poem foreshadows sacrifice.", resultCopy: "One peaceful sleeping image can make the coming loss hit even harder.", x: 75, y: 50, w: 174, requires: ["cross-concord"] },
      ],
    },
  ],
  "echo-forevermore": [
    {
      id: "echo-forevermore-chapter-1",
      title: "From Battle Into Memory",
      badge: "Aftermath",
      sceneTag: "aftermath",
      lineStart: 111,
      lineEnd: 118,
      location: "Roads, Fields, and Farm Walls",
      scenePrompt: "The poem stops following only Paul and starts widening into what happened after the warning spread.",
      narration: "Now Longfellow assumes the reader knows the battle story. He shows the fight in swift flashes across roads, fences, and fields.",
      significance: "This matters because the poem is no longer only about one rider. It is about what the warning made possible.",
      actions: [
        { id: "widen-story", label: "Widen the story", copy: "See the warning become a larger struggle.", resultTitle: "The ride grows into history.", resultCopy: "The warning mattered because people acted on it. The poem widens from one rider into many defenders.", x: 52, y: 61, w: 164, requires: [] },
        { id: "trace-resistance", label: "Trace the farmers' resistance", copy: "Follow the fight across fields and walls.", resultTitle: "The land itself joins the resistance.", resultCopy: "Fences, roads, and trees become part of the story. The countryside remembers what happened too.", x: 35, y: 72, w: 182, requires: ["widen-story"] },
      ],
    },
    {
      id: "echo-forevermore-chapter-2",
      title: "The Cry Goes On",
      badge: "Alarm",
      sceneTag: "echo-forevermore",
      lineStart: 119,
      lineEnd: 124,
      location: "Middlesex Villages",
      scenePrompt: "The poem returns to Paul Revere, but now he is becoming more than one person. He is becoming a lasting cry of alarm.",
      narration: "The rider moves back into view, yet he is now more mythic. His warning reaches doors, homes, and sleeping villages.",
      significance: "This matters because Longfellow turns the midnight ride into a symbol of courage and quick warning.",
      actions: [
        { id: "follow-alarm", label: "Follow the cry of alarm", copy: "Watch the warning move from village to village.", resultTitle: "The message keeps traveling.", resultCopy: "The poem wants the child to feel that one urgent message can wake an entire region.", x: 61, y: 68, w: 170, requires: [] },
        { id: "reach-doorways", label: "Reach the doors and windows", copy: "See how the warning enters homes.", resultTitle: "History becomes personal.", resultCopy: "A knock at the door is different from a battle scene. It makes the warning feel close to ordinary families.", x: 77, y: 47, w: 180, requires: ["follow-alarm"] },
      ],
    },
    {
      id: "echo-forevermore-chapter-3",
      title: "Night-Wind of the Past",
      badge: "Memory",
      sceneTag: "echo-forevermore",
      lineStart: 125,
      lineEnd: 127,
      location: "History's Dark Road",
      scenePrompt: "The poem becomes more poetic and timeless here. It is no longer just a literal night ride.",
      narration: "Longfellow lifts the story into memory itself. The night-wind now carries the message through all the years that follow.",
      significance: "This matters because the poem is explaining why the story still gets told. It is meant to live beyond its own night.",
      actions: [
        { id: "feel-memory", label: "Feel the story become memory", copy: "Notice the ride turning into legend.", resultTitle: "The poem leaves the road and enters history.", resultCopy: "This is where the story stops being only an event and becomes something people keep carrying forward.", x: 63, y: 60, w: 182, requires: [] },
        { id: "follow-nightwind", label: "Follow the night-wind of the past", copy: "Let the memory travel forward.", resultTitle: "The warning keeps moving through time.", resultCopy: "The night-wind image helps the child feel that history can still speak across generations.", x: 39, y: 46, w: 184, requires: ["feel-memory"] },
      ],
    },
    {
      id: "echo-forevermore-chapter-4",
      title: "Hoof-Beats Forevermore",
      badge: "Final Echo",
      sceneTag: "echo-forevermore",
      lineStart: 128,
      lineEnd: 130,
      location: "The Legendary Midnight Road",
      scenePrompt: "The ending should feel iconic. The hoofbeats are no longer only Paul Revere's. They become a symbol people still listen for.",
      narration: "The poem closes by turning sound into memory: hoofbeats, message, and midnight warning echoing forever.",
      significance: "This matters because the final lines explain why the poem survives. It asks every later generation to listen when danger comes.",
      actions: [
        { id: "listen-hoofbeats", label: "Listen for the hoofbeats", copy: "Hear the warning echo toward the future.", resultTitle: "The ride becomes a lasting signal.", resultCopy: "The last image is not only about one horse in one night. It is about staying awake when a warning matters.", x: 58, y: 68, w: 176, requires: [] },
        { id: "catch-message", label: "Catch the midnight message", copy: "Hold onto the poem's last meaning.", resultTitle: "The story lands in the present.", resultCopy: "The ending asks the reader to remember that courage and warning still matter now.", x: 73, y: 44, w: 176, requires: ["listen-hoofbeats"] },
      ],
    },
  ],
};

const state = {
  poemData: null,
  scheduleConfig: null,
  settings: null,
  progress: null,
  ui: {
    activeMode: "story",
    activeChapterId: null,
    currentHintLevel: 0,
    cloudTimeOffsetMs: 0,
    lastCloudSyncIso: null,
    clockSource: "browser-fallback",
    clockTimer: null,
    cadenceEnabled: false,
    cadenceInterval: null,
    cadenceBeat: 0,
    audioContext: null,
    ambientEnabled: false,
    ambientNodes: null,
    ambientAudio: null,
    speechRecognition: null,
    whisperTranscriber: null,
    whisperInitPromise: null,
    whisperStatus: "idle",
    whisperRecorder: null,
    whisperStream: null,
    whisperChunks: [],
    whisperAnalyser: null,
    whisperSourceNode: null,
    whisperSilenceFrame: null,
    whisperSilenceSinceMs: 0,
    whisperHeardSpeech: false,
    whisperSpeechMs: 0,
    whisperLastSampleMs: 0,
    whisperRecordingStartedAt: 0,
    isTranscribing: false,
    openAiTtsStatus: "idle",
    kokoroTts: null,
    kokoroInitPromise: null,
    kokoroStatus: "idle",
    neuralAudio: null,
    neuralAudioUrl: null,
    isListening: false,
    chapterAnimationPhase: 0,
    animationFrame: null,
    previousChapterId: null,
    chapterTransition: 0,
    availableVoices: [],
    storyImageCache: new Map(),
    pendingStoryImagePath: "",
    recitalActive: false,
    recitalLineNumber: null,
    recitalHintCount: 0,
    recitalAttemptCount: 0,
    retryRecitalLineNumber: null,
  },
};

const elements = {
  activeSectionLabel: document.getElementById("activeSectionLabel"),
  activeSectionDates: document.getElementById("activeSectionDates"),
  deadlineBanner: document.getElementById("deadlineBanner"),
  deadlineMessage: document.getElementById("deadlineMessage"),
  clockMessage: document.getElementById("clockMessage"),
  sectionProgressBar: document.getElementById("sectionProgressBar"),
  sectionProgressText: document.getElementById("sectionProgressText"),
  masteryProgressBar: document.getElementById("masteryProgressBar"),
  masteryProgressText: document.getElementById("masteryProgressText"),
  prefaceTitle: document.getElementById("prefaceTitle"),
  prefaceHook: document.getElementById("prefaceHook"),
  prefaceSignificance: document.getElementById("prefaceSignificance"),
  prefaceNoticeList: document.getElementById("prefaceNoticeList"),
  prefaceJourneyPrompt: document.getElementById("prefaceJourneyPrompt"),
  chapterTitle: document.getElementById("chapterTitle"),
  chapterBadge: document.getElementById("chapterBadge"),
  chapterLineRange: document.getElementById("chapterLineRange"),
  chapterNarration: document.getElementById("chapterNarration"),
  chapterMeaning: document.getElementById("chapterMeaning"),
  storyImage: document.getElementById("storyImage"),
  storyCanvas: document.getElementById("storyCanvas"),
  storyObjects: document.getElementById("storyObjects"),
  scenePoemText: document.getElementById("scenePoemText"),
  sceneLocation: document.getElementById("sceneLocation"),
  scenePrompt: document.getElementById("scenePrompt"),
  sceneMomentTitle: document.getElementById("sceneMomentTitle"),
  sceneMomentCopy: document.getElementById("sceneMomentCopy"),
  storyText: document.getElementById("storyText"),
  storyKeywords: document.getElementById("storyKeywords"),
  storyExplanation: document.getElementById("storyExplanation"),
  storyFeedback: document.getElementById("storyFeedback"),
  questTitle: document.getElementById("questTitle"),
  questStatus: document.getElementById("questStatus"),
  questInstruction: document.getElementById("questInstruction"),
  questActionRow: document.getElementById("questActionRow"),
  questFeedback: document.getElementById("questFeedback"),
  prevChapterBtn: document.getElementById("prevChapterBtn"),
  nextChapterBtn: document.getElementById("nextChapterBtn"),
  chapterList: document.getElementById("chapterList"),
  chapterTemplate: document.getElementById("chapterItemTemplate"),
  memorizeStageBadge: document.getElementById("memorizeStageBadge"),
  memorizeLineRange: document.getElementById("memorizeLineRange"),
  memorizeCheckpointTitle: document.getElementById("memorizeCheckpointTitle"),
  memorizeInstruction: document.getElementById("memorizeInstruction"),
  memorizePrompt: document.getElementById("memorizePrompt"),
  memorizeAttemptInput: document.getElementById("memorizeAttemptInput"),
  memorizeRecordBtn: document.getElementById("memorizeRecordBtn"),
  memorizeHintBtn: document.getElementById("memorizeHintBtn"),
  memorizeListenBtn: document.getElementById("memorizeListenBtn"),
  memorizeCheckBtn: document.getElementById("memorizeCheckBtn"),
  memorizeHintBox: document.getElementById("memorizeHintBox"),
  memorizeFeedback: document.getElementById("memorizeFeedback"),
  proveModeBadge: document.getElementById("proveModeBadge"),
  proveLineRange: document.getElementById("proveLineRange"),
  proveCheckpointTitle: document.getElementById("proveCheckpointTitle"),
  proveInstruction: document.getElementById("proveInstruction"),
  proveTargetCue: document.getElementById("proveTargetCue"),
  proveAttemptInput: document.getElementById("proveAttemptInput"),
  proveHintBtn: document.getElementById("proveHintBtn"),
  proveCheckBtn: document.getElementById("proveCheckBtn"),
  proveExitBtn: document.getElementById("proveExitBtn"),
  proveRetryBtn: document.getElementById("proveRetryBtn"),
  proveHintBox: document.getElementById("proveHintBox"),
  proveScoreBox: document.getElementById("proveScoreBox"),
  proveFeedback: document.getElementById("proveFeedback"),
  proveDiff: document.getElementById("proveDiff"),
  recordBtn: document.getElementById("recordBtn"),
  speakLinesBtn: document.getElementById("speakLinesBtn"),
  cadenceToggleBtn: document.getElementById("cadenceToggleBtn"),
  cadenceMessage: document.getElementById("cadenceMessage"),
  beatDots: [...document.querySelectorAll(".beat-dot")],
  ambientToggleBtn: document.getElementById("ambientToggleBtn"),
  speechSupportPill: document.getElementById("speechSupportPill"),
  autoModeToggle: document.getElementById("autoModeToggle"),
  sectionSelect: document.getElementById("sectionSelect"),
  explanationsToggle: document.getElementById("explanationsToggle"),
  speechToggle: document.getElementById("speechToggle"),
  strictnessSelect: document.getElementById("strictnessSelect"),
  voiceSelect: document.getElementById("voiceSelect"),
  cloudPasskeyInput: document.getElementById("cloudPasskeyInput"),
  cloudSaveBtn: document.getElementById("cloudSaveBtn"),
  cloudLoadBtn: document.getElementById("cloudLoadBtn"),
  cloudSaveFeedback: document.getElementById("cloudSaveFeedback"),
  exportProgressBtn: document.getElementById("exportProgressBtn"),
  importProgressInput: document.getElementById("importProgressInput"),
  resetProgressBtn: document.getElementById("resetProgressBtn"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
  panels: {
    story: document.getElementById("storyPanel"),
    memorize: document.getElementById("memorizePanel"),
    prove: document.getElementById("provePanel"),
  },
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const [poemData, scheduleConfig] = await Promise.all([
      fetch("./content/poem-data.json").then((response) => response.json()),
      fetch("./content/schedule-config.json").then((response) => response.json()),
    ]);

    state.poemData = poemData;
    state.scheduleConfig = scheduleConfig;
    state.settings = loadSettings(scheduleConfig);
    state.progress = loadProgress();

    await syncTrustedClock();
    setupSpeechSupport();
    bindEvents();
    setupCanvas();
    startClock();
    startAnimationLoop();
    ensureProgressShape();
    render();
  } catch (error) {
    console.error(error);
    handleFatalStartupError(error);
  }
}

function bindEvents() {
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.ui.recitalActive && button.dataset.mode !== "prove") {
        setFeedback(elements.proveFeedback, "Recital mode is locked. Finish the line or tap Exit recital to leave and restart it.", "warning");
        return;
      }
      state.ui.activeMode = button.dataset.mode;
      render();
    });
  });

  elements.speakLinesBtn.addEventListener("click", () => {
    const chapter = getActiveChapter();
    if (chapter) speakLines(chapter.lines);
  });

  elements.cadenceToggleBtn.addEventListener("click", toggleCadence);
  elements.ambientToggleBtn.addEventListener("click", toggleAmbient);
  elements.prevChapterBtn.addEventListener("click", () => moveChapter(-1));
  elements.nextChapterBtn.addEventListener("click", advanceStoryNavigation);

  elements.memorizeHintBtn.addEventListener("click", () => {
    state.ui.currentHintLevel += 1;
    renderMemorizePanel();
  });
  elements.memorizeListenBtn.addEventListener("click", () => {
    const chapter = getActiveChapter();
    if (chapter) speakLines(chapter.lines);
  });
  elements.memorizeRecordBtn.addEventListener("click", toggleSpeechRecording);
  elements.memorizeCheckBtn.addEventListener("click", handleMemorizeCheck);
  elements.proveHintBtn.addEventListener("click", handleProveHint);
  elements.proveCheckBtn.addEventListener("click", handleProveCheck);
  elements.proveExitBtn.addEventListener("click", exitRecitalSession);
  elements.proveRetryBtn.addEventListener("click", retryRecitalSession);
  elements.recordBtn.addEventListener("click", toggleSpeechRecording);
  elements.memorizeAttemptInput.addEventListener("input", () => {
    elements.memorizeAttemptInput.dataset.inputSource = "typed";
  });
  elements.proveAttemptInput.addEventListener("input", () => {
    elements.proveAttemptInput.dataset.inputSource = "typed";
  });

  elements.autoModeToggle.addEventListener("change", () => {
    state.settings.progressionMode = elements.autoModeToggle.checked ? "automatic" : "manual";
    saveSettings();
    ensureProgressShape();
    render();
  });

  elements.sectionSelect.addEventListener("change", () => {
    state.settings.manualActiveSectionId = elements.sectionSelect.value;
    saveSettings();
    ensureProgressShape();
    render();
  });

  elements.explanationsToggle.addEventListener("change", () => {
    state.settings.showExplanations = elements.explanationsToggle.checked;
    saveSettings();
    renderStoryPanel();
  });

  elements.speechToggle.addEventListener("change", () => {
    state.settings.speechEnabled = elements.speechToggle.checked;
    saveSettings();
    renderSpeechSupport();
  });

  elements.voiceSelect.addEventListener("change", () => {
    state.settings.preferredVoiceURI = elements.voiceSelect.value || "auto";
    saveSettings();
    renderSpeechSupport();
  });

  elements.cloudPasskeyInput.addEventListener("input", () => {
    state.settings.cloudPasskey = normalizePasskey(elements.cloudPasskeyInput.value);
    elements.cloudPasskeyInput.value = state.settings.cloudPasskey;
    saveSettings();
  });
  elements.cloudSaveBtn.addEventListener("click", saveCloudProgress);
  elements.cloudLoadBtn.addEventListener("click", loadCloudProgress);

  elements.strictnessSelect.addEventListener("change", () => {
    state.settings.strictnessLevel = elements.strictnessSelect.value;
    saveSettings();
  });

  elements.exportProgressBtn.addEventListener("click", exportProgress);
  elements.importProgressInput.addEventListener("change", importProgress);
  elements.resetProgressBtn.addEventListener("click", resetProgress);
}

function setupCanvas() {
  if (!elements.storyCanvas) {
    throw new Error("storyCanvas element is missing");
  }
  const resize = () => {
    const rect = elements.storyCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    elements.storyCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
    elements.storyCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
    drawStoryScene();
  };
  resize();
  window.addEventListener("resize", resize);
}

function setupSpeechSupport() {
  refreshAvailableVoices();
  if (window.speechSynthesis?.addEventListener) {
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
  } else if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.onresult = (event) => {
      const chapter = getActiveChapter();
      const line = chapter ? getFocusLine(chapter, "prove") : null;
      const alternatives = [...event.results[0]].map((result) => result.transcript?.trim()).filter(Boolean);
      const transcript = selectSpeechTranscript(alternatives, line?.text);
      if (!transcript) {
        setFeedback(elements.proveFeedback, "The microphone heard something too far from the poem line. Try again, or type it instead.", "warning");
        state.ui.isListening = false;
        updateRecordButton();
        return;
      }

      elements.proveAttemptInput.value = transcript;
      state.ui.isListening = false;
      updateRecordButton();
      if (line) {
        const preview = evaluateAttempt(transcript, line.text, state.settings.strictnessLevel);
        const tone = preview.outcome === "pass" ? "positive" : preview.outcome === "close" ? "warning" : "neutral";
        const message = preview.outcome === "pass"
          ? "The microphone heard a strong match for the poem line. Press Check recitation to lock it in."
          : preview.outcome === "close"
            ? "The microphone heard most of the line. Press Check recitation, or tidy the wording first."
            : "The microphone caught part of it, but typing may be faster for this one.";
        setFeedback(elements.proveFeedback, message, tone);
      } else {
        setFeedback(elements.proveFeedback, "I heard your recitation. Press Check recitation when you're ready.", "neutral");
      }
    };
    recognition.onerror = () => {
      state.ui.isListening = false;
      updateRecordButton();
      setFeedback(elements.proveFeedback, "The microphone was fuzzy that time. Typing still works perfectly.", "warning");
    };
    recognition.onend = () => {
      state.ui.isListening = false;
      updateRecordButton();
    };
    state.ui.speechRecognition = recognition;
  }
  renderSpeechSupport();
}

function handleVoicesChanged() {
  refreshAvailableVoices();
  populateVoiceSelect();
  renderSpeechSupport();
}

function refreshAvailableVoices() {
  state.ui.availableVoices = window.speechSynthesis?.getVoices?.() ?? [];
}

function loadSettings(scheduleConfig) {
  const current = safelyParse(localStorage.getItem(SETTINGS_KEY));
  const legacy = LEGACY_SETTINGS_KEYS.map((key) => safelyParse(localStorage.getItem(key))).find(Boolean);
  const saved = current ?? legacy;
  const savedVoicePreference = ["browser:auto", "openai:marin"].includes(saved?.preferredVoiceURI)
    ? "openai:verse"
    : saved?.preferredVoiceURI;
  return {
    progressionMode: saved?.progressionMode ?? scheduleConfig.defaultProgressionMode ?? "manual",
    manualActiveSectionId: saved?.manualActiveSectionId ?? scheduleConfig.manualActiveSectionId,
    showExplanations: saved?.showExplanations ?? true,
    speechEnabled: saved?.speechEnabled ?? true,
    strictnessLevel: saved?.strictnessLevel ?? "standard",
    preferredVoiceURI: savedVoicePreference ?? "openai:verse",
    cloudPasskey: saved?.cloudPasskey ?? "",
  };
}

function loadProgress() {
  const current = safelyParse(localStorage.getItem(STORAGE_KEY));
  const legacy = LEGACY_PROGRESS_KEYS.map((key) => safelyParse(localStorage.getItem(key))).find(Boolean);
  return current ?? legacy ?? { sections: {} };
}

function render() {
  const errors = [];
  const steps = [
    ensureProgressShape,
    populateSettings,
    renderPreface,
    renderModeTabs,
    renderChapterList,
    renderStoryPanel,
    renderMemorizePanel,
    renderProvePanel,
    renderProgressMeters,
    renderDeadlineBanner,
    renderCadenceState,
    renderSpeechSupport,
  ];

  steps.forEach((step) => {
    try {
      step();
    } catch (error) {
      console.error(`Render step failed: ${step.name}`, error);
      errors.push(`${step.name}: ${error.message}`);
    }
  });

  if (errors.length) {
    setFeedback(elements.storyFeedback, `The storybook loaded with errors: ${errors[0]}`, "negative");
  }
}

function populateSettings() {
  elements.autoModeToggle.checked = state.settings.progressionMode === "automatic";
  elements.explanationsToggle.checked = state.settings.showExplanations;
  elements.speechToggle.checked = state.settings.speechEnabled;
  elements.sectionSelect.innerHTML = state.scheduleConfig.sections
    .map((section) => `<option value="${section.id}">${section.title} (${section.lineStart}-${section.lineEnd})</option>`)
    .join("");
  elements.sectionSelect.value = getActiveSection().id;
  elements.sectionSelect.disabled = state.settings.progressionMode === "automatic";
  elements.strictnessSelect.innerHTML = Object.entries(state.scheduleConfig.strictnessLevels)
    .map(([value, strictness]) => `<option value="${value}">${strictness.label}</option>`)
    .join("");
  elements.strictnessSelect.value = state.settings.strictnessLevel;
  if (elements.cloudPasskeyInput) {
    elements.cloudPasskeyInput.value = state.settings.cloudPasskey ?? "";
  }
  populateVoiceSelect();
}

function populateVoiceSelect() {
  const voices = state.ui.availableVoices.filter((voice) => /^en(-|_|$)/i.test(voice.lang ?? "") || /english/i.test(voice.name));
  const autoVoice = getPreferredVoice();
  const options = [
    `<option value="openai:verse">OpenAI: Verse</option>`,
    `<option value="browser:auto">Browser fallback (${escapeHtml(autoVoice?.name ?? "Best available English voice")})</option>`,
    ...voices.map((voice) => `<option value="${escapeHtml(voice.voiceURI)}">${escapeHtml(`Browser: ${voice.name} (${voice.lang})`)}</option>`),
  ];
  elements.voiceSelect.innerHTML = options.join("");
  elements.voiceSelect.value = state.settings.preferredVoiceURI ?? "openai:verse";
  if (![...elements.voiceSelect.options].some((option) => option.value === elements.voiceSelect.value)) {
    elements.voiceSelect.value = "openai:verse";
  }
}

function renderPreface() {
  const intro = state.scheduleConfig.storybookIntro;
  if (!intro) return;
  elements.prefaceTitle.textContent = intro.title;
  elements.prefaceHook.textContent = intro.hook;
  elements.prefaceSignificance.textContent = intro.significance;
  elements.prefaceJourneyPrompt.textContent = intro.journeyPrompt;
  elements.prefaceNoticeList.innerHTML = intro.whatToNotice
    .map((point) => `<li>${escapeHtml(point)}</li>`)
    .join("");
}

function renderModeTabs() {
  const chapter = getActiveChapter();
  const proveLine = chapter ? getFocusLine(chapter, "prove") : null;
  if (state.ui.activeMode === "prove" && proveLine) {
    ensureRecitalSession(proveLine.lineNumber);
  }
  Object.entries(elements.panels).forEach(([mode, panel]) => {
    const active = mode === state.ui.activeMode;
    panel.hidden = !active;
    panel.classList.toggle("active-panel", active);
  });
  elements.tabButtons.forEach((button) => {
    const active = button.dataset.mode === state.ui.activeMode;
    const lockedAway = state.ui.recitalActive && button.dataset.mode !== "prove";
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.disabled = lockedAway;
  });
}

function renderChapterList() {
  const chapters = getActiveChapters();
  elements.chapterList.innerHTML = "";
  chapters.forEach((chapter, index) => {
    const chapterProgress = getChapterProgress(chapter.id);
    const unlocked = index <= getStoryUnlockedChapterIndex();
    const node = document.createElement("li");
    node.className = "checkpoint-item";
    node.innerHTML = `
      <button class="checkpoint-button" type="button">
        <span class="checkpoint-status"></span>
        <span class="checkpoint-copy">
          <strong class="checkpoint-name"></strong>
          <span class="checkpoint-lines"></span>
        </span>
      </button>
    `;
    const button = node.querySelector(".checkpoint-button");
    button.classList.toggle("locked", !unlocked);
    button.classList.toggle("unlocked", unlocked);
    button.classList.toggle("completed", chapterProgress.proveComplete);
    button.classList.toggle("active", chapter.id === state.ui.activeChapterId);
    button.disabled = !unlocked;
    button.querySelector(".checkpoint-name").textContent = chapter.title;
    button.querySelector(".checkpoint-lines").textContent = `Lines ${chapter.lineStart}-${chapter.lineEnd}`;
    button.addEventListener("click", () => {
      setActiveChapter(chapter.id);
    });
    elements.chapterList.append(node);
  });
}

function renderStoryPanel() {
  const chapter = getActiveChapter();
  if (!chapter) return;

  const chapterProgress = getChapterProgress(chapter.id);
  const questDone = chapter.actions.every((action) => chapterProgress.storyActions[action.id]);
  const chapterIndex = getActiveChapters().findIndex((entry) => entry.id === chapter.id);

  elements.chapterTitle.textContent = chapter.title;
  elements.chapterBadge.textContent = chapter.badge ?? `Chapter ${chapterIndex + 1}`;
  elements.chapterLineRange.textContent = `Lines ${chapter.lineStart}-${chapter.lineEnd}`;
  elements.chapterNarration.textContent = chapter.narration;
  elements.chapterMeaning.textContent = chapter.significance;
  elements.sceneLocation.textContent = chapter.location ?? chapter.title;
  elements.scenePrompt.textContent = chapter.scenePrompt ?? chapter.significance;
  elements.scenePoemText.innerHTML = renderLinesMarkup(chapter.lines, { highlightKeywords: false, compact: true });
  elements.storyText.innerHTML = renderLinesMarkup(chapter.lines, { highlightKeywords: true });
  elements.storyKeywords.innerHTML = gatherKeywords(chapter.lines)
    .map((keyword) => `<span class="keyword-chip">${escapeHtml(keyword)}</span>`)
    .join("");
  elements.storyExplanation.textContent = buildExplanation(chapter.lines, chapter.significance);
  elements.storyExplanation.parentElement.open = state.settings.showExplanations;
  renderSceneMoment(chapter, chapterProgress, questDone);
  renderStoryIllustration(chapter, chapterProgress);

  renderStoryObjects(chapter);
  drawStoryScene();
  renderQuestPanel(chapter, questDone);

  setFeedback(
    elements.storyFeedback,
    questDone
      ? "Scene complete. The story beat is alive now. You can turn the page or practice the lines."
      : "Complete the scene action to move from understanding into memorization.",
    questDone ? "positive" : "neutral",
  );

  const isLastScene = chapterIndex >= getActiveChapters().length - 1;
  const nextSection = getAdjacentSection(1);
  elements.prevChapterBtn.disabled = chapterIndex === 0;
  elements.nextChapterBtn.textContent = isLastScene ? "Next chapter" : "Next scene";
  if (isLastScene) {
    elements.nextChapterBtn.disabled = !questDone || !nextSection;
  } else {
    elements.nextChapterBtn.disabled = chapterIndex >= Math.min(getStoryUnlockedChapterIndex() + 1, getActiveChapters().length - 1) || !questDone;
  }
}

function renderQuestPanel(chapter, questDone) {
  const chapterProgress = getChapterProgress(chapter.id);
  const completedCount = chapter.actions.filter((action) => chapterProgress.storyActions[action.id]).length;
  elements.questTitle.textContent = chapter.title;
  elements.questInstruction.textContent = chapter.significance;
  elements.questStatus.textContent = questDone
    ? "Scene complete"
    : completedCount > 0
      ? "Keep going"
      : "Start the scene";
  elements.questStatus.className = `quest-status ${questDone ? "done" : completedCount > 0 ? "ready" : "locked"}`;
  elements.questActionRow.innerHTML = "";
  chapter.actions.forEach((action) => {
    const chip = document.createElement("span");
    chip.className = "pill";
    chip.textContent = `${action.label}: ${chapterProgress.storyActions[action.id] ? "done" : "find it in the scene"}`;
    elements.questActionRow.append(chip);
  });
  setFeedback(
    elements.questFeedback,
    questDone
      ? "You acted out this part of the poem. Now the lines should feel less like random words and more like a story moment."
      : "Tap the glowing story markers in the illustration. Each one unlocks the next idea the poem is building.",
    questDone ? "positive" : "neutral",
  );
}

function renderStoryObjects(chapter) {
  const chapterProgress = getChapterProgress(chapter.id);
  elements.storyObjects.innerHTML = "";

  chapter.actions.forEach((action) => {
    const ready = action.requires.every((dependency) => chapterProgress.storyActions[dependency]);
    const done = chapterProgress.storyActions[action.id];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `story-object ${done ? "done" : ready ? "ready" : "locked"}`;
    button.style.left = `${action.x}%`;
    button.style.top = `${action.y}%`;
    button.style.width = `${action.w}px`;
    button.disabled = !ready;
    button.innerHTML = `
      <span class="story-object-ping" aria-hidden="true"></span>
      <span class="story-object-card">
        <span class="story-object-title">${escapeHtml(action.label)}</span>
        <span class="story-object-copy">${escapeHtml(done ? "Scene clue found" : action.copy)}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      if (done) {
        revisitStoryAction(chapter, action);
        return;
      }
      completeStoryAction(chapter, action);
    });
    elements.storyObjects.append(button);
  });
}

function renderSceneMoment(chapter, chapterProgress, questDone) {
  const activeAction = chapter.actions.find((action) => action.id === chapterProgress.activeStoryActionId && chapterProgress.storyActions[action.id]);
  if (activeAction) {
    elements.sceneMomentTitle.textContent = activeAction.resultTitle ?? activeAction.label;
    elements.sceneMomentCopy.textContent = activeAction.resultCopy ?? activeAction.copy;
    return;
  }

  const completed = chapter.actions.filter((action) => chapterProgress.storyActions[action.id]);
  const latest = completed.at(-1);

  if (latest) {
    elements.sceneMomentTitle.textContent = latest.resultTitle ?? latest.label;
    elements.sceneMomentCopy.textContent = latest.resultCopy ?? latest.copy;
    return;
  }

  if (questDone) {
    elements.sceneMomentTitle.textContent = "This scene is now part of the story in your mind.";
    elements.sceneMomentCopy.textContent = chapter.significance;
    return;
  }

  elements.sceneMomentTitle.textContent = chapter.scenePrompt ?? "Step into the story.";
  elements.sceneMomentCopy.textContent = "Start with the glowing marker. Each click should reveal why this chapter matters, not just what happens.";
}

function renderStoryIllustration(chapter, chapterProgress) {
  const pages = chapterStoryPages[chapter.id] ?? [];
  if (!pages.length) {
    elements.storyImage.removeAttribute("src");
    elements.storyImage.removeAttribute("data-active-src");
    elements.storyImage.classList.remove("visible");
    elements.storyCanvas.classList.remove("hidden-canvas");
    return;
  }

  const activeActionIndex = chapter.actions.findIndex((action) => action.id === chapterProgress.activeStoryActionId && chapterProgress.storyActions[action.id]);
  const completedActions = chapter.actions.filter((action) => chapterProgress.storyActions[action.id]).length;
  const pageIndex = activeActionIndex >= 0
    ? clamp(activeActionIndex + 1, 0, pages.length - 1)
    : clamp(completedActions, 0, pages.length - 1);
  const pagePath = pages[pageIndex];
  elements.storyImage.alt = `${chapter.title} storybook page ${pageIndex + 1}`;
  pages.forEach((path) => preloadStoryImage(path));
  showStoryImage(pagePath);
}

function showStoryImage(pagePath) {
  if (!pagePath) return;
  const activeSrc = elements.storyImage.getAttribute("data-active-src");
  if (activeSrc === pagePath && elements.storyImage.classList.contains("visible")) {
    elements.storyCanvas.classList.add("hidden-canvas");
    return;
  }

  state.ui.pendingStoryImagePath = pagePath;
  preloadStoryImage(pagePath)
    .then(() => {
      if (state.ui.pendingStoryImagePath !== pagePath) return;
      elements.storyImage.src = pagePath;
      elements.storyImage.setAttribute("data-active-src", pagePath);
      elements.storyImage.classList.add("visible");
      elements.storyCanvas.classList.add("hidden-canvas");
    })
    .catch((error) => {
      console.warn("Story image failed to load.", error);
      if (state.ui.pendingStoryImagePath !== pagePath) return;
      elements.storyImage.src = pagePath;
      elements.storyImage.setAttribute("data-active-src", pagePath);
      elements.storyImage.classList.add("visible");
      elements.storyCanvas.classList.add("hidden-canvas");
    });
}

function preloadStoryImage(pagePath) {
  if (!pagePath) return Promise.resolve();
  const cached = state.ui.storyImageCache.get(pagePath);
  if (cached) return cached;

  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(pagePath);
    image.onerror = reject;
    image.src = pagePath;
    if (image.complete) {
      resolve(pagePath);
    }
  });

  state.ui.storyImageCache.set(pagePath, promise);
  return promise;
}

function renderMemorizePanel() {
  const chapter = getActiveChapter();
  if (!chapter) return;

  const chapterProgress = getChapterProgress(chapter.id);
  const storyDone = chapter.actions.every((action) => chapterProgress.storyActions[action.id]);
  const stage = Math.min(chapterProgress.memorizeStage, 5);
  const stageDef = stageDefinitions[stage - 1];
  const focusLine = getFocusLine(chapter, "memorize");
  const progressCount = Math.min(chapterProgress.memorizeLineIndex, chapter.lines.length);

  elements.memorizeCheckpointTitle.textContent = chapter.title;
  elements.memorizeStageBadge.textContent = stageDef.label;
  elements.memorizeLineRange.textContent = focusLine ? `Line ${focusLine.lineNumber} next • ${progressCount}/${chapter.lines.length} unlocked` : `Lines ${chapter.lineStart}-${chapter.lineEnd}`;
  elements.memorizeInstruction.textContent = `${stageDef.instruction} Unlock each line in order. Once one is right, it appears and the next one stays hidden.`;
  elements.memorizePrompt.innerHTML = renderPracticeMarkup(chapter.lines, focusLine, stage, chapterProgress.memorizeLineIndex);
  elements.memorizeAttemptInput.disabled = !storyDone;
  elements.memorizeRecordBtn.disabled = !storyDone || !focusLine || !state.settings.speechEnabled || !hasMicInputSupport() || state.ui.isTranscribing;
  elements.memorizeCheckBtn.disabled = !storyDone;
  elements.memorizeHintBtn.disabled = !storyDone;
  elements.memorizeListenBtn.disabled = !storyDone || !state.settings.speechEnabled;

  const hint = getHintForLine(focusLine, state.ui.currentHintLevel);
  elements.memorizeHintBox.hidden = !hint;
  elements.memorizeHintBox.textContent = hint ?? "";
  if (!storyDone) {
    setFeedback(elements.memorizeFeedback, "Finish the story scene first so the lines belong to a real picture in your mind.", "warning");
  }
}

function renderProvePanel() {
  const chapter = getActiveChapter();
  if (!chapter) return;

  const chapterProgress = getChapterProgress(chapter.id);
  const storyDone = chapter.actions.every((action) => chapterProgress.storyActions[action.id]);
  const line = getFocusLine(chapter, "prove");
  const recitalSummaryLine = getRecitalSummaryLine(chapter);
  if (line && state.ui.activeMode === "prove") {
    ensureRecitalSession(line.lineNumber);
  }

  elements.proveCheckpointTitle.textContent = chapter.title;
  elements.proveLineRange.textContent = line ? `Line ${line.lineNumber}` : "Chapter clear";
  elements.proveInstruction.textContent = line
    ? "Recital mode is on. The other tabs stay locked until you prove this line or exit recital."
    : "This chapter's lines are mastered. Move forward or revisit it any time.";
  elements.proveTargetCue.textContent = line
    ? "No built-in cue here. Use a hint only if you need one."
    : "All lines in this chapter are mastered.";
  elements.proveAttemptInput.disabled = !storyDone || !line;
  elements.proveCheckBtn.disabled = !storyDone || !line;
  elements.proveHintBtn.disabled = !storyDone || !line;
  elements.proveExitBtn.disabled = !line || !state.ui.recitalActive;
  elements.proveRetryBtn.disabled = !storyDone || !recitalSummaryLine;
  elements.recordBtn.disabled = !storyDone || !line || !state.settings.speechEnabled || !hasMicInputSupport() || state.ui.isTranscribing;
  elements.proveScoreBox.textContent = recitalSummaryLine
    ? buildRecitalSummary(chapterProgress.lines[recitalSummaryLine.lineNumber], recitalSummaryLine.lineNumber)
    : "No recital score yet. Start recital and prove a line from memory.";
  elements.proveScoreBox.hidden = false;

  if (!storyDone) {
    setFeedback(elements.proveFeedback, "Complete the story scene first. The recital should come after the meaning.", "warning");
  }
}

function renderProgressMeters() {
  const section = getActiveSection();
  const chapters = getActiveChapters();
  const chapterCompletions = chapters.filter((chapter) => getChapterProgress(chapter.id).proveComplete).length;
  const totalLines = getSectionLines(section).length;
  const masteredLines = countMasteredLines(section.id);
  const chapterPercent = chapters.length ? Math.round((chapterCompletions / chapters.length) * 100) : 0;
  const masteryPercent = totalLines ? Math.round((masteredLines / totalLines) * 100) : 0;

  elements.activeSectionLabel.textContent = section.title;
  elements.activeSectionDates.textContent = buildSectionStatusLabel(section);
  elements.sectionProgressBar.value = chapterPercent;
  elements.sectionProgressText.textContent = `${chapterPercent}% complete`;
  elements.masteryProgressBar.value = masteryPercent;
  elements.masteryProgressText.textContent = `${masteredLines} of ${totalLines} lines mastered`;
}

function renderDeadlineBanner() {
  const countdownTarget = getNextCountdownTarget();
  const now = getPhoenixNow();
  elements.clockMessage.textContent = buildClockMessage(now);

  if (!countdownTarget) {
    elements.deadlineBanner.className = "deadline-banner calm";
    elements.deadlineMessage.textContent = "Every scheduled section is mastered. Keep telling the whole story.";
    return;
  }

  const dueAt = getDueDateTime(countdownTarget.date);
  const msRemaining = dueAt.getTime() - now.getTime();
  const hoursRemaining = Math.ceil(msRemaining / 3600000);
  const targetLabel = buildCountdownTargetLabel(countdownTarget);

  if (msRemaining < 0) {
    const overdueDays = Math.ceil(Math.abs(msRemaining) / 86400000);
    elements.deadlineBanner.className = "deadline-banner urgent";
    elements.deadlineMessage.textContent = `YOU ARE ${overdueDays} DAY${overdueDays === 1 ? "" : "S"} PAST DUE FOR ${targetLabel}.`;
    return;
  }

  if (hoursRemaining <= 24) {
    elements.deadlineBanner.className = "deadline-banner urgent";
    elements.deadlineMessage.textContent = `YOU HAVE ${hoursRemaining} HOUR${hoursRemaining === 1 ? "" : "S"} LEFT FOR ${targetLabel}.`;
    return;
  }

  const daysRemaining = Math.ceil(msRemaining / 86400000);
  elements.deadlineBanner.className = daysRemaining <= 3 ? "deadline-banner warning" : "deadline-banner calm";
  elements.deadlineMessage.textContent = `YOU HAVE ${daysRemaining} DAY${daysRemaining === 1 ? "" : "S"} LEFT FOR ${targetLabel}.`;
}

function renderCadenceState() {
  elements.cadenceToggleBtn.setAttribute("aria-pressed", String(state.ui.cadenceEnabled));
  elements.cadenceToggleBtn.textContent = state.ui.cadenceEnabled ? "Cadence on" : "Cadence off";
  elements.cadenceMessage.textContent = state.ui.cadenceEnabled
    ? "4-beat pulse is running. Feel the poem like footsteps and hoofbeats."
    : "4-beat pulse ready for the poem's hoofbeat rhythm.";
  updateBeatDots();
}

function ensureProgressShape() {
  if (!state.progress || typeof state.progress !== "object") {
    state.progress = { sections: {} };
  }
  if (!state.progress.sections || typeof state.progress.sections !== "object") {
    state.progress.sections = {};
  }

  const section = getActiveSection();
  if (!state.progress.sections[section.id]) {
    state.progress.sections[section.id] = { chapters: {} };
  }
  if (!state.progress.sections[section.id].chapters) {
    state.progress.sections[section.id].chapters = {};
  }

  getActiveChapters().forEach((chapter) => {
    if (!state.progress.sections[section.id].chapters[chapter.id]) {
      state.progress.sections[section.id].chapters[chapter.id] = {
        storyActions: {},
        memorizeStage: 1,
        memorizeLineIndex: 0,
        lines: {},
        proveComplete: false,
        lastRecitalLineNumber: null,
      };
    }
    const chapterProgress = state.progress.sections[section.id].chapters[chapter.id];
    if (!chapterProgress.storyActions) chapterProgress.storyActions = {};
    if (typeof chapterProgress.activeStoryActionId !== "string") chapterProgress.activeStoryActionId = "";
    if (typeof chapterProgress.memorizeStage !== "number") chapterProgress.memorizeStage = 1;
    if (typeof chapterProgress.memorizeLineIndex !== "number") chapterProgress.memorizeLineIndex = 0;
    if (!chapterProgress.lines) chapterProgress.lines = {};
    if (typeof chapterProgress.proveComplete !== "boolean") chapterProgress.proveComplete = false;
    if (typeof chapterProgress.lastRecitalLineNumber !== "number" && chapterProgress.lastRecitalLineNumber !== null) chapterProgress.lastRecitalLineNumber = null;

    chapter.actions.forEach((action) => {
      if (typeof chapterProgress.storyActions[action.id] !== "boolean") {
        chapterProgress.storyActions[action.id] = false;
      }
    });

    chapter.lines.forEach((line) => {
      if (!chapterProgress.lines[line.lineNumber]) {
        chapterProgress.lines[line.lineNumber] = {
          attempts: 0,
          successes: 0,
          bestScore: 0,
          mastered: false,
          recitalHintsUsed: 0,
          recitalExitCount: 0,
          lastRecitalScore: null,
          bestRecitalScore: 0,
          lastRecitalAttempts: 0,
          lastRecitalHints: 0,
          lastRecitalExited: false,
          lastRecitalOutcome: "",
        };
      } else {
        const lineProgress = chapterProgress.lines[line.lineNumber];
        if (typeof lineProgress.attempts !== "number") lineProgress.attempts = 0;
        if (typeof lineProgress.successes !== "number") lineProgress.successes = 0;
        if (typeof lineProgress.bestScore !== "number") lineProgress.bestScore = 0;
        if (typeof lineProgress.mastered !== "boolean") lineProgress.mastered = false;
        if (typeof lineProgress.recitalHintsUsed !== "number") lineProgress.recitalHintsUsed = 0;
        if (typeof lineProgress.recitalExitCount !== "number") lineProgress.recitalExitCount = 0;
        if (typeof lineProgress.lastRecitalScore !== "number" && lineProgress.lastRecitalScore !== null) lineProgress.lastRecitalScore = null;
        if (typeof lineProgress.bestRecitalScore !== "number") lineProgress.bestRecitalScore = 0;
        if (typeof lineProgress.lastRecitalAttempts !== "number") lineProgress.lastRecitalAttempts = 0;
        if (typeof lineProgress.lastRecitalHints !== "number") lineProgress.lastRecitalHints = 0;
        if (typeof lineProgress.lastRecitalExited !== "boolean") lineProgress.lastRecitalExited = false;
        if (typeof lineProgress.lastRecitalOutcome !== "string") lineProgress.lastRecitalOutcome = "";
      }
    });
  });

  if (!state.ui.activeChapterId || !getActiveChapters().some((chapter) => chapter.id === state.ui.activeChapterId)) {
    state.ui.activeChapterId = getActiveChapters()[0]?.id ?? null;
    state.ui.previousChapterId = null;
    state.ui.chapterTransition = 0;
  }

  saveProgress();
}

function getActiveSection() {
  const sections = state.scheduleConfig.sections;
  if (state.settings.progressionMode === "manual") {
    return sections.find((section) => section.id === state.settings.manualActiveSectionId) ?? sections[0];
  }

  const today = getPhoenixNow().toISOString().slice(0, 10);
  const dateUnlockedIndex = Math.max(
    0,
    sections.reduce((bestIndex, section, index) => (
      section.unlockDate && section.unlockDate <= today ? index : bestIndex
    ), -1),
  );
  const masteryUnlockedIndex = getMasteryUnlockedSectionIndex();
  return sections[Math.max(dateUnlockedIndex, masteryUnlockedIndex)] ?? sections[0];
}

function getNextDeadlineSection() {
  return state.scheduleConfig.sections.find((section) => !isSectionCompleted(section.id) && section.unlockDate) ?? null;
}

function getNextCountdownTarget() {
  const nextSection = getNextDeadlineSection();
  if (nextSection) {
    return {
      type: "section",
      date: nextSection.unlockDate,
      section: nextSection,
    };
  }

  const finalRecital = state.scheduleConfig.finalRecital;
  if (!finalRecital?.date) return null;

  return {
    type: "final-recital",
    date: finalRecital.date,
    label: finalRecital.label,
    message: finalRecital.message,
  };
}

function buildCountdownTargetLabel(target) {
  if (target.type === "section") {
    return `LINES ${target.section.lineStart}-${target.section.lineEnd}`;
  }
  return `${(target.label ?? "FINAL RECITAL").toUpperCase()}${target.message ? `: ${target.message.toUpperCase()}` : ""}`;
}

function getSectionLines(section) {
  return state.poemData.lines.filter((line) => line.lineNumber >= section.lineStart && line.lineNumber <= section.lineEnd);
}

function getActiveChapters() {
  return buildChaptersForSection(getActiveSection());
}

function getActiveChapter() {
  return getActiveChapters().find((chapter) => chapter.id === state.ui.activeChapterId) ?? null;
}

function getChapterProgress(chapterId) {
  return state.progress.sections[getActiveSection().id].chapters[chapterId];
}

function getUnlockedChapterIndex() {
  const chapters = getActiveChapters();
  let unlockedIndex = 0;
  for (let index = 0; index < chapters.length; index += 1) {
    const progress = getChapterProgress(chapters[index].id);
    if (progress.proveComplete) {
      unlockedIndex = Math.min(index + 1, chapters.length - 1);
    } else {
      break;
    }
  }
  return unlockedIndex;
}

function getStoryUnlockedChapterIndex() {
  const chapters = getActiveChapters();
  let unlockedIndex = 0;
  for (let index = 0; index < chapters.length - 1; index += 1) {
    const progress = getChapterProgress(chapters[index].id);
    const storyDone = chapters[index].actions.every((action) => progress.storyActions[action.id]);
    if (!storyDone) break;
    unlockedIndex = index + 1;
  }
  return unlockedIndex;
}

function moveChapter(direction) {
  const chapters = getActiveChapters();
  const currentIndex = chapters.findIndex((chapter) => chapter.id === state.ui.activeChapterId);
  const unlockedIndex = Math.min(getStoryUnlockedChapterIndex() + 1, chapters.length - 1);
  const nextIndex = clamp(currentIndex + direction, 0, unlockedIndex);
  setActiveChapter(chapters[nextIndex]?.id ?? state.ui.activeChapterId);
}

function advanceStoryNavigation() {
  const chapters = getActiveChapters();
  const currentIndex = chapters.findIndex((chapter) => chapter.id === state.ui.activeChapterId);
  const currentChapter = chapters[currentIndex];
  if (!currentChapter) return;

  const chapterProgress = getChapterProgress(currentChapter.id);
  const questDone = currentChapter.actions.every((action) => chapterProgress.storyActions[action.id]);
  if (!questDone) return;

  const isLastScene = currentIndex >= chapters.length - 1;
  if (!isLastScene) {
    moveChapter(1);
    return;
  }

  const nextSection = getAdjacentSection(1);
  if (!nextSection) return;
  goToSection(nextSection.id);
}

function setActiveChapter(chapterId) {
  if (!chapterId || chapterId === state.ui.activeChapterId) return;
  state.ui.previousChapterId = state.ui.activeChapterId;
  state.ui.activeChapterId = chapterId;
  state.ui.currentHintLevel = 0;
  state.ui.chapterTransition = 1;
  render();
}

function getAdjacentSection(direction) {
  const sections = state.scheduleConfig.sections;
  const activeSection = getActiveSection();
  const currentIndex = sections.findIndex((section) => section.id === activeSection.id);
  if (currentIndex < 0) return null;
  return sections[currentIndex + direction] ?? null;
}

function goToSection(sectionId) {
  const nextSection = state.scheduleConfig.sections.find((section) => section.id === sectionId);
  if (!nextSection) return;
  state.settings.manualActiveSectionId = nextSection.id;
  if (state.settings.progressionMode !== "manual") {
    state.settings.progressionMode = "manual";
    elements.autoModeToggle.checked = false;
  }
  saveSettings();
  ensureProgressShape();
  const chapters = getActiveChapters();
  state.ui.previousChapterId = null;
  state.ui.activeChapterId = chapters[0]?.id ?? null;
  state.ui.chapterTransition = 0;
  state.ui.currentHintLevel = 0;
  render();
}

function completeStoryAction(chapter, action) {
  const chapterProgress = getChapterProgress(chapter.id);
  chapterProgress.storyActions[action.id] = true;
  chapterProgress.activeStoryActionId = action.id;
  saveProgress();
  renderStoryPanel();
  if (chapter.actions.every((entry) => chapterProgress.storyActions[entry.id])) {
    setFeedback(elements.storyFeedback, `${action.label} revealed the heart of this scene. Turn the page or practice the lines while the picture is still vivid.`, "positive");
  } else {
    setFeedback(elements.storyFeedback, `${action.label} changed the scene. There is still one more story clue to uncover here.`, "positive");
  }
}

function revisitStoryAction(chapter, action) {
  const chapterProgress = getChapterProgress(chapter.id);
  if (!chapterProgress.storyActions[action.id]) return;
  chapterProgress.activeStoryActionId = action.id;
  saveProgress();
  renderStoryIllustration(chapter, chapterProgress);
  renderSceneMoment(chapter, chapterProgress, chapter.actions.every((entry) => chapterProgress.storyActions[entry.id]));
  setFeedback(elements.storyFeedback, `${action.label} is open again. Revisit the story beat, then keep going when you're ready.`, "neutral");
}

function handleMemorizeCheck() {
  const chapter = getActiveChapter();
  const focusLine = getFocusLine(chapter, "memorize");
  if (!focusLine) {
    setFeedback(elements.memorizeFeedback, "This memorization stage is already complete. Move on to the next stage or recital.", "positive");
    return;
  }
  const answer = elements.memorizeAttemptInput.value.trim();
  if (!answer) {
    setFeedback(elements.memorizeFeedback, "Type the next hidden line so I can help check it.", "warning");
    return;
  }

  const result = evaluateAttempt(answer, focusLine.text, state.settings.strictnessLevel);
  if (result.outcome === "pass") {
    const chapterProgress = getChapterProgress(chapter.id);
    chapterProgress.memorizeLineIndex += 1;
    if (chapterProgress.memorizeLineIndex >= chapter.lines.length) {
      chapterProgress.memorizeStage = Math.min(chapterProgress.memorizeStage + 1, 5);
      chapterProgress.memorizeLineIndex = 0;
    }
    elements.memorizeAttemptInput.value = "";
    state.ui.currentHintLevel = 0;
    saveProgress();
    setFeedback(
      elements.memorizeFeedback,
      chapterProgress.memorizeLineIndex === 0
        ? "Nice work. You cleared that whole memory stage and unlocked the next one."
        : "Nice work. That line is unlocked. The next hidden line is ready.",
      "positive",
    );
    renderMemorizePanel();
    return;
  }

  setFeedback(
    elements.memorizeFeedback,
    `${result.outcome === "close" ? "You got most of it." : "Almost there."} ${buildFeedbackFromResult(result)}`,
    result.outcome === "close" ? "warning" : "negative",
  );
}

function handleProveHint() {
  const chapter = getActiveChapter();
  const line = getFocusLine(chapter, "prove");
  if (line) {
    ensureRecitalSession(line.lineNumber);
    state.ui.recitalHintCount += 1;
    const lineProgress = getChapterProgress(chapter.id).lines[line.lineNumber];
    lineProgress.recitalHintsUsed += 1;
  }
  state.ui.currentHintLevel += 1;
  const hint = line ? getHintForLine(line, state.ui.currentHintLevel) : "This chapter is already mastered.";
  elements.proveHintBox.hidden = false;
  elements.proveHintBox.textContent = hint;
  saveProgress();
  renderProvePanel();
}

function handleProveCheck() {
  const chapter = getActiveChapter();
  const line = getFocusLine(chapter, "prove");
  if (!line) {
    setFeedback(elements.proveFeedback, "This chapter is already mastered.", "positive");
    return;
  }

  const answer = elements.proveAttemptInput.value.trim();
  if (!answer) {
    setFeedback(elements.proveFeedback, "Type or say the line before checking it.", "warning");
    return;
  }

  ensureRecitalSession(line.lineNumber);
  state.ui.recitalAttemptCount += 1;
  const result = evaluateAttempt(answer, line.text, state.settings.strictnessLevel);
  const speechAdjustedResult = maybePromoteSpeechRecitalResult(
    result,
    line.text,
    elements.proveAttemptInput.dataset.inputSource === "speech",
    state.settings.strictnessLevel,
  );
  const chapterProgress = getChapterProgress(chapter.id);
  chapterProgress.lastRecitalLineNumber = line.lineNumber;
  const lineProgress = chapterProgress.lines[line.lineNumber];
  lineProgress.attempts += 1;
  lineProgress.bestScore = Math.max(lineProgress.bestScore, speechAdjustedResult.score);

  if (speechAdjustedResult.outcome === "pass") {
    const recitalScore = calculateRecitalScore({
      hints: state.ui.recitalHintCount,
      attempts: state.ui.recitalAttemptCount,
      exited: false,
    });
    lineProgress.mastered = true;
    lineProgress.successes += 1;
    lineProgress.lastRecitalScore = recitalScore;
    lineProgress.bestRecitalScore = Math.max(lineProgress.bestRecitalScore, recitalScore);
    lineProgress.lastRecitalAttempts = state.ui.recitalAttemptCount;
    lineProgress.lastRecitalHints = state.ui.recitalHintCount;
    lineProgress.lastRecitalExited = false;
    lineProgress.lastRecitalOutcome = "passed";
    state.ui.retryRecitalLineNumber = null;
    elements.proveAttemptInput.value = "";
    elements.proveAttemptInput.dataset.inputSource = "";
    state.ui.currentHintLevel = 0;
    elements.proveHintBox.hidden = true;
    elements.proveDiff.hidden = true;
    resetRecitalSession();
    maybeCompleteChapter(chapter.id);
    saveProgress();
    render();
    setFeedback(elements.proveFeedback, `You got it. That line is now part of your mastered story. Recital score: ${recitalScore}.`, "positive");
    return;
  }

  saveProgress();
  elements.proveDiff.hidden = false;
  elements.proveDiff.innerHTML = renderDiff(speechAdjustedResult);
  setFeedback(
    elements.proveFeedback,
    `${speechAdjustedResult.outcome === "close" ? "You got most of it." : "The line needs another try."} ${buildFeedbackFromResult(speechAdjustedResult)}`,
    speechAdjustedResult.outcome === "close" ? "warning" : "negative",
  );
}

function ensureRecitalSession(lineNumber) {
  if (state.ui.recitalActive && state.ui.recitalLineNumber === lineNumber) return;
  state.ui.recitalActive = true;
  state.ui.recitalLineNumber = lineNumber;
  state.ui.recitalHintCount = 0;
  state.ui.recitalAttemptCount = 0;
  state.ui.currentHintLevel = 0;
  elements.proveHintBox.hidden = true;
}

function resetRecitalSession() {
  state.ui.recitalActive = false;
  state.ui.recitalLineNumber = null;
  state.ui.recitalHintCount = 0;
  state.ui.recitalAttemptCount = 0;
}

function retryRecitalSession() {
  const chapter = getActiveChapter();
  const recitalSummaryLine = chapter ? getRecitalSummaryLine(chapter) : null;
  if (!recitalSummaryLine) return;
  state.ui.retryRecitalLineNumber = recitalSummaryLine.lineNumber;
  state.ui.activeMode = "prove";
  ensureRecitalSession(recitalSummaryLine.lineNumber);
  render();
  setFeedback(elements.proveFeedback, `Retry recital is ready for line ${recitalSummaryLine.lineNumber}. The score can improve without erasing mastery.`, "neutral");
}

function exitRecitalSession() {
  const chapter = getActiveChapter();
  const line = chapter ? getFocusLine(chapter, "prove") : null;
  if (!line || !state.ui.recitalActive) return;
  const chapterProgress = getChapterProgress(chapter.id);
  chapterProgress.lastRecitalLineNumber = line.lineNumber;
  const lineProgress = chapterProgress.lines[line.lineNumber];
  const recitalScore = calculateRecitalScore({
    hints: state.ui.recitalHintCount,
    attempts: Math.max(state.ui.recitalAttemptCount, 1),
    exited: true,
  });
  lineProgress.recitalExitCount += 1;
  lineProgress.lastRecitalScore = recitalScore;
  lineProgress.lastRecitalAttempts = Math.max(state.ui.recitalAttemptCount, 1);
  lineProgress.lastRecitalHints = state.ui.recitalHintCount;
  lineProgress.lastRecitalExited = true;
  lineProgress.lastRecitalOutcome = "exited";
  state.ui.retryRecitalLineNumber = null;
  elements.proveAttemptInput.value = "";
  elements.proveAttemptInput.dataset.inputSource = "";
  elements.proveHintBox.hidden = true;
  elements.proveDiff.hidden = true;
  resetRecitalSession();
  state.ui.activeMode = "memorize";
  saveProgress();
  render();
  setFeedback(elements.memorizeFeedback, `Recital exited. That line's last recital score was ${recitalScore}, and the recital will restart fresh next time.`, "warning");
}

function calculateRecitalScore({ hints = 0, attempts = 1, exited = false }) {
  let score = 100;
  if (hints >= 1) score -= 10;
  if (hints >= 2) score -= 15;
  if (hints >= 3) score -= 20;
  score -= Math.min(15, Math.max(0, attempts - 1) * 5);
  if (exited) score -= 15;
  return clamp(score, 0, 100);
}

function buildRecitalSummary(lineProgress) {
  if (!lineProgress || !lineProgress.lastRecitalOutcome) {
    return "No recital score yet. Start recital and prove a line from memory.";
  }
  const outcomeLabel = lineProgress.lastRecitalOutcome === "passed" ? "Passed" : "Exited";
  return `Last recital: ${outcomeLabel} • Score ${lineProgress.lastRecitalScore ?? 0} • Hints ${lineProgress.lastRecitalHints} • Attempts ${lineProgress.lastRecitalAttempts}${lineProgress.lastRecitalExited ? " • exited" : ""}`;
}

function maybeCompleteChapter(chapterId) {
  const chapter = getActiveChapters().find((entry) => entry.id === chapterId);
  const chapterProgress = getChapterProgress(chapterId);
  chapterProgress.proveComplete = chapter.lines.every((line) => chapterProgress.lines[line.lineNumber].mastered);
  if (chapterProgress.proveComplete) {
    maybePromoteSectionUnlock();
  }
}

function getFocusLine(chapter, mode) {
  const chapterProgress = getChapterProgress(chapter.id);
  if (mode === "memorize") {
    return chapter.lines[Math.min(chapterProgress.memorizeLineIndex, chapter.lines.length - 1)] ?? chapter.lines[0];
  }
  if (state.ui.retryRecitalLineNumber != null) {
    return chapter.lines.find((line) => line.lineNumber === state.ui.retryRecitalLineNumber) ?? null;
  }
  return chapter.lines.find((line) => !chapterProgress.lines[line.lineNumber].mastered) ?? null;
}

function getRecitalSummaryLine(chapter) {
  const chapterProgress = getChapterProgress(chapter.id);
  const focusLine = getFocusLine(chapter, "prove");
  if (focusLine) return focusLine;
  if (chapterProgress.lastRecitalLineNumber != null) {
    return chapter.lines.find((line) => line.lineNumber === chapterProgress.lastRecitalLineNumber) ?? null;
  }
  return chapter.lines.find((line) => chapterProgress.lines[line.lineNumber]?.lastRecitalOutcome) ?? null;
}

function countMasteredLines(sectionId) {
  const sectionProgress = state.progress.sections[sectionId];
  if (!sectionProgress?.chapters) return 0;
  return Object.values(sectionProgress.chapters)
    .flatMap((chapter) => Object.values(chapter.lines ?? {}))
    .filter((line) => line.mastered)
    .length;
}

function getMasteryUnlockedSectionIndex() {
  const sections = state.scheduleConfig.sections;
  let unlockedIndex = 0;
  for (let index = 0; index < sections.length - 1; index += 1) {
    if (!isSectionCompleted(sections[index].id)) break;
    unlockedIndex = index + 1;
  }
  return unlockedIndex;
}

function isSectionCompleted(sectionId) {
  const section = state.scheduleConfig.sections.find((entry) => entry.id === sectionId);
  if (!section) return false;
  const progress = state.progress.sections[sectionId];
  if (!progress?.chapters) return false;
  const chapters = buildChaptersForSection(section);
  return chapters.every((chapter) => progress.chapters?.[chapter.id]?.proveComplete);
}

function buildChaptersForSection(section) {
  const lines = getSectionLines(section);
  if (sectionChapterBlueprints[section.id]) {
    return sectionChapterBlueprints[section.id].map((blueprint) => ({
      ...blueprint,
      lines: lines.filter((line) => line.lineNumber >= blueprint.lineStart && line.lineNumber <= blueprint.lineEnd),
    }));
  }
  if (section.id === "churchyard-watch") {
    return Object.entries(chapterBlueprints).map(([id, blueprint]) => ({
      id,
      ...blueprint,
      lines: lines.filter((line) => line.lineNumber >= blueprint.lineStart && line.lineNumber <= blueprint.lineEnd),
    }));
  }
  const size = section.checkpointSize ?? 4;
  const chapters = [];
  for (let start = 0; start < lines.length; start += size) {
    const chunk = lines.slice(start, start + size);
    chapters.push({
      id: `${section.id}-chapter-${chapters.length + 1}`,
      title: `Chapter ${chapters.length + 1}`,
      badge: `Lines ${chunk[0]?.lineNumber ?? "?"}-${chunk[chunk.length - 1]?.lineNumber ?? "?"}`,
      sceneTag: chunk[0]?.sceneTag ?? "journey",
      lineStart: chunk[0]?.lineNumber ?? section.lineStart,
      lineEnd: chunk.at(-1)?.lineNumber ?? section.lineEnd,
      narration: "This part of the story continues the warning ride. Read the poem lines, picture the scene, and then memorize them.",
      significance: "Notice what changes in the poem's mood, motion, and danger here.",
      actions: [
        { id: "notice-scene", label: "Notice the scene", copy: "Take in the story moment.", x: 32, y: 60, w: 144, requires: [] },
        { id: "carry-story", label: "Carry the story onward", copy: "Turn this moment into memory.", x: 58, y: 50, w: 156, requires: ["notice-scene"] },
      ],
      lines: chunk,
    });
  }
  return chapters;
}

function maybePromoteSectionUnlock() {
  const section = getActiveSection();
  if (!isSectionCompleted(section.id)) return;
  const index = state.scheduleConfig.sections.findIndex((entry) => entry.id === section.id);
  const next = state.scheduleConfig.sections[index + 1];
  if (!next) return;
  setFeedback(elements.storyFeedback, `Chapter section complete. The next scheduled section is now unlocked early: ${next.title}.`, "positive");
}

function buildSectionStatusLabel(section) {
  if (state.settings.progressionMode === "manual") {
    return section.unlockDate ? `Manual parent choice. Schedule date: ${section.unlockDate}` : "Manual parent choice";
  }
  const masteryIndex = getMasteryUnlockedSectionIndex();
  const sectionIndex = state.scheduleConfig.sections.findIndex((entry) => entry.id === section.id);
  if (sectionIndex > 0 && sectionIndex <= masteryIndex) {
    return `Unlocked early by mastery${section.unlockDate ? `, schedule date ${section.unlockDate}` : ""}`;
  }
  return section.unlockDate ? `Schedule date: ${section.unlockDate}` : "Automatic progression";
}

function evaluateAttempt(answer, target, strictnessLevel) {
  const normalizedAnswer = normalizeText(answer);
  const normalizedTarget = normalizeText(target);
  const answerWords = normalizedAnswer.split(" ").filter(Boolean);
  const targetWords = normalizedTarget.split(" ").filter(Boolean);
  const contentWords = targetWords.filter((word) => word.length > 3 && !WORD_CONNECTORS.has(word));
  const strictness = state.scheduleConfig.strictnessLevels[strictnessLevel] ?? state.scheduleConfig.strictnessLevels.standard;

  const charScore = 1 - (levenshtein(normalizedAnswer, normalizedTarget) / Math.max(normalizedTarget.length, 1));
  const wordScore = 1 - (levenshtein(answerWords.join("|"), targetWords.join("|")) / Math.max(targetWords.join("|").length, 1));
  const overlapScore = wordOverlap(answerWords, targetWords);
  const orderedScore = orderedMatchScore(answerWords, targetWords);
  const contentScore = contentWords.length ? contentCoverage(answerWords, contentWords) : 1;
  const edgeScore = edgeWordScore(answerWords, targetWords);
  const score = clamp(
    charScore * 0.14
      + wordScore * 0.18
      + overlapScore * 0.22
      + orderedScore * 0.22
      + contentScore * 0.18
      + edgeScore * 0.06,
    0,
    1,
  );

  const missingImportantWords = contentWords.filter((word) => !answerWords.includes(word));
  const outcome = normalizedAnswer === normalizedTarget
    ? "pass"
    : score >= strictness.passThreshold && missingImportantWords.length <= strictness.allowedContentMisses
      ? "pass"
      : score >= strictness.closeThreshold
        ? "close"
        : "retry";

  return {
    outcome,
    score,
    diff: buildDiff(answerWords, targetWords),
    missingImportantWords,
    metrics: {
      charScore,
      wordScore,
      overlapScore,
      orderedScore,
      contentScore,
      edgeScore,
    },
  };
}

function maybePromoteSpeechRecitalResult(result, target, fromSpeech, strictnessLevel) {
  if (!fromSpeech || result.outcome === "pass") return result;

  const strictness = state.scheduleConfig.strictnessLevels[strictnessLevel] ?? state.scheduleConfig.strictnessLevels.standard;
  const targetWordCount = normalizeText(target).split(" ").filter(Boolean).length;
  const nearPassFloor = strictness.passThreshold - Math.min(0.1, targetWordCount <= 7 ? 0.1 : 0.08);
  const speechworthy =
    result.score >= nearPassFloor
    && result.missingImportantWords.length <= strictness.allowedContentMisses + 1
    && (result.metrics?.overlapScore ?? 0) >= 0.72
    && (result.metrics?.orderedScore ?? 0) >= 0.68
    && (result.metrics?.contentScore ?? 0) >= 0.7
    && (result.diff?.extra?.length ?? 0) === 0
    && (result.diff?.substitutions?.length ?? 0) === 0;

  if (!speechworthy) return result;

  return {
    ...result,
    outcome: "pass",
  };
}

function buildDiff(answerWords, targetWords) {
  const missing = [];
  const extra = [];
  const substitutions = [];
  const maxLength = Math.max(answerWords.length, targetWords.length);
  for (let index = 0; index < maxLength; index += 1) {
    const actual = answerWords[index];
    const expected = targetWords[index];
    if (actual === expected) continue;
    if (expected && !answerWords.includes(expected)) missing.push(expected);
    if (actual && !targetWords.includes(actual)) extra.push(actual);
    if (actual && expected) substitutions.push(`${actual} -> ${expected}`);
  }
  return {
    missing: [...new Set(missing)].slice(0, 6),
    extra: [...new Set(extra)].slice(0, 4),
    substitutions: [...new Set(substitutions)].slice(0, 3),
  };
}

function buildFeedbackFromResult(result) {
  if (result.missingImportantWords.length) {
    return `You skipped a key phrase. Catch these words: ${result.missingImportantWords.slice(0, 4).join(", ")}.`;
  }
  if (result.diff.substitutions.length) {
    return "A few words changed places or became different words. Try keeping the poem's order tighter.";
  }
  if (result.diff.missing.length) {
    return `Try again with the middle part. Key words to catch: ${result.diff.missing.join(", ")}.`;
  }
  if (result.diff.extra.length) {
    return "You added a few extra words. Keep closer to the poem's wording.";
  }
  return "Keep the line in the same order as the poem.";
}

function renderDiff(result) {
  const chunks = [];
  if (result.missingImportantWords.length) {
    chunks.push(`<p><strong>Key phrase missing:</strong> ${escapeHtml(result.missingImportantWords.join(", "))}</p>`);
  }
  if (result.diff.missing.length) {
    chunks.push(`<p><strong>Missing words:</strong> ${escapeHtml(result.diff.missing.join(", "))}</p>`);
  }
  if (result.diff.substitutions.length) {
    chunks.push(`<p><strong>Word swaps:</strong> ${escapeHtml(result.diff.substitutions.join(", "))}</p>`);
  }
  if (result.diff.extra.length) {
    chunks.push(`<p><strong>Extra words:</strong> ${escapeHtml(result.diff.extra.join(", "))}</p>`);
  }
  chunks.push(`<p><strong>Match score:</strong> ${Math.round(result.score * 100)}%</p>`);
  return chunks.join("");
}

function renderLinesMarkup(lines, options = {}) {
  return lines.map((line) => {
    const content = options.highlightKeywords
      ? highlightKeywords(line.text, line.keywords ?? [])
      : escapeHtml(line.text);
    const lineClass = options.compact ? "scene-poem-line" : "poem-line";
    return `<p class="${lineClass}"><span class="line-number">${line.lineNumber}.</span> ${content}</p>`;
  }).join("");
}

function renderPracticeMarkup(lines, focusLine, stage, unlockedCount = 0) {
  return lines.map((line, index) => {
    let display = `<span class="ghost-word blurred-line">${escapeHtml(line.text)}</span>`;
    let extraClass = "locked-line";

    if (index < unlockedCount) {
      display = escapeHtml(line.text);
      extraClass = "revealed-line";
    } else if (focusLine && line.lineNumber === focusLine.lineNumber) {
      extraClass = "target-line";
      if (stage === 1) display = keywordOnlyMarkup(line);
      if (stage === 2) display = missingWordsMarkup(line);
      if (stage === 3) display = firstLetterMarkup(line.text);
      if (stage === 4) display = `<span class="ghost-word">${"____ ".repeat(normalizeText(line.text).split(" ").length).trim()}</span>`;
      if (stage === 5) display = `<span class="ghost-word">${"____ ".repeat(normalizeText(line.text).split(" ").length).trim()}</span>`;
    }

    return `<p class="poem-line ${extraClass}"><span class="line-number">${line.lineNumber}.</span> ${display}</p>`;
  }).join("");
}

function keywordOnlyMarkup(line) {
  const keywords = gatherKeywords([line]).map((keyword) => keyword.toLowerCase());
  return line.text.split(/(\s+)/).map((token) => {
    const cleaned = normalizeToken(token);
    if (!cleaned) return escapeHtml(token);
    if (keywords.includes(cleaned)) return `<span class="highlight-word">${escapeHtml(token)}</span>`;
    return `<span class="ghost-word">...</span>`;
  }).join("");
}

function missingWordsMarkup(line) {
  const keywords = gatherKeywords([line]).map((keyword) => keyword.toLowerCase());
  return line.text.split(/(\s+)/).map((token, index) => {
    const cleaned = normalizeToken(token);
    if (!cleaned) return escapeHtml(token);
    if (keywords.includes(cleaned) || index % 4 === 0) return `<span class="highlight-word">${escapeHtml(token)}</span>`;
    const punctuation = /[,:;.!?]$/.test(token) ? escapeHtml(token.slice(-1)) : "";
    return `<span class="ghost-word">____</span>${punctuation}`;
  }).join(" ");
}

function firstLetterMarkup(text) {
  return text.split(/\s+/).map((word) => `<span class="cue-word">${escapeHtml(word[0] ?? "")}${"_".repeat(Math.max(word.length - 1, 0))}</span>`).join(" ");
}

function firstLetters(text) {
  return normalizeText(text).split(" ").map((word) => word[0]).join(" ");
}

function gatherKeywords(lines) {
  const all = lines.flatMap((line) => line.keywords ?? []);
  if (all.length) return [...new Set(all)].slice(0, 8);
  return [...new Set(lines.flatMap((line) => extractKeywords(line.text)))].slice(0, 8);
}

function extractKeywords(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 4 && !WORD_CONNECTORS.has(word))
    .slice(0, 4);
}

function buildExplanation(lines, significance) {
  const explained = lines.find((line) => line.kidExplanation)?.kidExplanation;
  return explained ?? significance ?? "Notice how the poem uses setting, mood, and motion to make the warning feel important.";
}

function getHintForLine(line, level) {
  if (!line || level <= 0) return null;
  if (level === 1) return `First word: ${line.text.split(" ")[0]}`;
  if (level === 2) return `First letters: ${firstLetters(line.text)}`;
  const words = line.text.split(" ");
  const revealCount = Math.max(3, Math.floor(words.length / 3));
  return `Peek at part of it: ${words.map((word, index) => (index < revealCount || index >= words.length - 2 ? word : "____")).join(" ")}`;
}

function selectSpeechTranscript(alternatives, expectedText) {
  if (!alternatives.length) return "";
  if (!expectedText) {
    return cleanSpeechTranscript(alternatives[0], "");
  }

  const candidates = alternatives
    .map((alternative) => cleanSpeechTranscript(alternative, expectedText))
    .filter(Boolean);

  if (!candidates.length) return "";

  const ranked = candidates
    .map((candidate) => ({
      transcript: candidate,
      result: evaluateAttempt(candidate, expectedText, state.settings.strictnessLevel),
    }))
    .sort((a, b) => b.result.score - a.result.score);

  const best = ranked[0];
  return best.result.score >= 0.34 ? best.transcript : "";
}

function cleanSpeechTranscript(transcript, expectedText) {
  const rawWords = transcript.trim().split(/\s+/).filter(Boolean);
  if (!rawWords.length) return "";

  let words = collapseRepeatedWords(rawWords);
  words = collapseRepeatedPhrases(words);

  if (!expectedText) {
    return words.join(" ").trim();
  }

  const targetWords = normalizeText(expectedText).split(" ").filter(Boolean);
  const targetSet = new Set(targetWords);
  const filtered = words
    .map((word) => normalizeToken(word))
    .filter(Boolean)
    .map((word) => {
      if (targetSet.has(word)) return word;
      const bestMatch = findClosestTargetWord(word, targetWords);
      if (bestMatch.score >= 0.92) return bestMatch.word;
      if (bestMatch.score >= 0.72 && word.length <= 5) return bestMatch.word;
      return null;
    })
    .filter(Boolean);

  const cleaned = collapseRepeatedWords(filtered);
  return repairTranscriptAgainstTarget(cleaned, targetWords);
}

function repairTranscriptAgainstTarget(answerWords, targetWords) {
  if (!answerWords.length) return "";

  const matchedIndices = [];
  let searchIndex = 0;
  answerWords.forEach((word) => {
    for (let index = searchIndex; index < targetWords.length; index += 1) {
      if (targetWords[index] === word) {
        matchedIndices.push(index);
        searchIndex = index + 1;
        return;
      }
    }
  });

  const orderedMatch = matchedIndices.length === answerWords.length;
  const startsAtBeginning = matchedIndices[0] === 0;
  const reachesEnding = matchedIndices.at(-1) >= targetWords.length - 2;
  const coverage = answerWords.length / Math.max(targetWords.length, 1);
  const targetContentWords = targetWords.filter((word) => word.length > 3 && !WORD_CONNECTORS.has(word));
  const answerSet = new Set(answerWords);
  const missingContentWords = targetContentWords.filter((word) => !answerSet.has(word));

  if (orderedMatch && startsAtBeginning && reachesEnding && coverage >= 0.5 && missingContentWords.length === 0) {
    return targetWords.join(" ");
  }

  return answerWords.join(" ").trim();
}

function collapseRepeatedWords(words) {
  const collapsed = [];
  words.forEach((word) => {
    if (!collapsed.length || normalizeToken(collapsed[collapsed.length - 1]) !== normalizeToken(word)) {
      collapsed.push(word);
    }
  });
  return collapsed;
}

function collapseRepeatedPhrases(words) {
  if (words.length < 4) return words;
  const output = [];
  for (let index = 0; index < words.length; index += 1) {
    const current = normalizeToken(words[index]);
    const next = normalizeToken(words[index + 1] ?? "");
    const nextPairA = normalizeToken(words[index + 2] ?? "");
    const nextPairB = normalizeToken(words[index + 3] ?? "");
    if (current && next && current === nextPairA && next === nextPairB) {
      output.push(words[index], words[index + 1]);
      index += 3;
      continue;
    }
    output.push(words[index]);
  }
  return output;
}

function findClosestTargetWord(word, targetWords) {
  let bestWord = "";
  let bestScore = 0;
  targetWords.forEach((targetWord) => {
    const maxLen = Math.max(word.length, targetWord.length, 1);
    const score = 1 - (levenshtein(word, targetWord) / maxLen);
    if (score > bestScore) {
      bestScore = score;
      bestWord = targetWord;
    }
  });
  return { word: bestWord, score: bestScore };
}

function toggleSpeechRecording() {
  if (!state.settings.speechEnabled || !hasMicInputSupport()) {
    setModeFeedback("Microphone recitation is not available here, so typing is ready instead.", "warning");
    return;
  }
  if (supportsWhisperRecording()) {
    toggleWhisperRecording();
    return;
  }
  if (state.ui.isListening) {
    state.ui.speechRecognition.stop();
    state.ui.isListening = false;
  } else {
    state.ui.speechRecognition.start();
    state.ui.isListening = true;
    setModeFeedback("Listening now. Say the line clearly, then wait for the words to appear.", "neutral");
  }
  updateRecordButton();
}

function updateRecordButton() {
  const memorizeLabel = state.ui.isTranscribing ? "Transcribing..." : state.ui.isListening ? "Stop recording" : "Use microphone";
  const proveLabel = supportsWhisperRecording()
    ? memorizeLabel
    : state.ui.isTranscribing
      ? "Transcribing..."
      : state.ui.isListening
        ? "Stop microphone"
        : "Use microphone";
  if (elements.memorizeRecordBtn) {
    elements.memorizeRecordBtn.textContent = memorizeLabel;
  }
  if (elements.recordBtn) {
    elements.recordBtn.textContent = proveLabel;
  }
}

function setModeFeedback(message, tone) {
  const target = state.ui.activeMode === "memorize" ? elements.memorizeFeedback : elements.proveFeedback;
  setFeedback(target, message, tone);
}

function getRecordingContext() {
  const chapter = getActiveChapter();
  if (!chapter) return null;
  if (state.ui.activeMode === "memorize") {
    return {
      mode: "memorize",
      line: getFocusLine(chapter, "memorize"),
      input: elements.memorizeAttemptInput,
      feedback: elements.memorizeFeedback,
    };
  }
  return {
    mode: "prove",
    line: getFocusLine(chapter, "prove"),
    input: elements.proveAttemptInput,
    feedback: elements.proveFeedback,
  };
}

function hasMicInputSupport() {
  return supportsWhisperRecording() || Boolean(state.ui.speechRecognition);
}

function supportsWhisperRecording() {
  return typeof navigator !== "undefined"
    && Boolean(navigator.mediaDevices?.getUserMedia)
    && typeof MediaRecorder !== "undefined";
}

async function toggleWhisperRecording() {
  if (state.ui.isTranscribing) return;

  if (state.ui.isListening && state.ui.whisperRecorder) {
    state.ui.whisperRecorder.stop();
    state.ui.isListening = false;
    updateRecordButton();
    setModeFeedback("Recording stopped. Transcribing now...", "neutral");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    state.ui.whisperChunks = [];
    state.ui.whisperStream = stream;
    state.ui.whisperRecorder = recorder;
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) {
        state.ui.whisperChunks.push(event.data);
      }
    });
    recorder.addEventListener("stop", async () => {
      const heardSpeech = state.ui.whisperHeardSpeech;
      const speechMs = state.ui.whisperSpeechMs;
      const recordingMs = Math.max(0, performance.now() - (state.ui.whisperRecordingStartedAt || 0));
      const blob = new Blob(state.ui.whisperChunks, { type: recorder.mimeType || "audio/webm" });
      cleanupWhisperRecorder();
      if (!heardSpeech || speechMs < 220 || recordingMs < 900) {
        setModeFeedback("No clear speech was heard, so nothing was transcribed. Try again and say the line out loud.", "warning");
        return;
      }
      await transcribeWhisperBlob(blob);
    });
    recorder.start();
    state.ui.whisperRecordingStartedAt = performance.now();
    startWhisperSilenceMonitor(stream, recorder);
    state.ui.isListening = true;
    updateRecordButton();
    setModeFeedback("Recording now. Say the line. It will stop after about 2 seconds of silence, or you can tap again to stop.", "neutral");
  } catch (error) {
    console.warn("Unable to start Whisper recording.", error);
    cleanupWhisperRecorder();
    setModeFeedback("I couldn't start the microphone. Typing still works perfectly.", "warning");
  }
}

function cleanupWhisperRecorder() {
  if (state.ui.whisperSilenceFrame) {
    cancelAnimationFrame(state.ui.whisperSilenceFrame);
    state.ui.whisperSilenceFrame = null;
  }
  state.ui.whisperSourceNode?.disconnect?.();
  state.ui.whisperAnalyser = null;
  state.ui.whisperSourceNode = null;
  state.ui.whisperSilenceSinceMs = 0;
  state.ui.whisperHeardSpeech = false;
  state.ui.whisperSpeechMs = 0;
  state.ui.whisperLastSampleMs = 0;
  state.ui.whisperRecordingStartedAt = 0;
  state.ui.whisperRecorder?.stream?.getTracks?.().forEach((track) => track.stop());
  state.ui.whisperStream?.getTracks?.().forEach((track) => track.stop());
  state.ui.whisperRecorder = null;
  state.ui.whisperStream = null;
  state.ui.whisperChunks = [];
  state.ui.isListening = false;
  updateRecordButton();
}

function startWhisperSilenceMonitor(stream, recorder) {
  try {
    const audioCtx = ensureAudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    state.ui.whisperSourceNode = source;
    state.ui.whisperAnalyser = analyser;
    state.ui.whisperSilenceSinceMs = 0;
    state.ui.whisperHeardSpeech = false;
    state.ui.whisperSpeechMs = 0;
    state.ui.whisperLastSampleMs = performance.now();

    const samples = new Uint8Array(analyser.fftSize);
    const monitor = () => {
      if (!state.ui.whisperRecorder || state.ui.whisperRecorder !== recorder || recorder.state !== "recording") {
        state.ui.whisperSilenceFrame = null;
        return;
      }

      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i += 1) {
        const normalized = (samples[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / samples.length);
      const now = performance.now();
      const deltaMs = Math.max(0, now - (state.ui.whisperLastSampleMs || now));
      state.ui.whisperLastSampleMs = now;

      if (rms > 0.045) {
        state.ui.whisperSpeechMs += deltaMs;
        if (state.ui.whisperSpeechMs >= 180) {
          state.ui.whisperHeardSpeech = true;
        }
        state.ui.whisperSilenceSinceMs = 0;
      } else if (state.ui.whisperHeardSpeech) {
        if (!state.ui.whisperSilenceSinceMs) {
          state.ui.whisperSilenceSinceMs = now;
        } else if (now - state.ui.whisperSilenceSinceMs >= 2000) {
          recorder.stop();
          state.ui.isListening = false;
          updateRecordButton();
          return;
        }
      }

      state.ui.whisperSilenceFrame = requestAnimationFrame(monitor);
    };

    state.ui.whisperSilenceFrame = requestAnimationFrame(monitor);
  } catch (error) {
    console.warn("Whisper silence monitor could not start.", error);
  }
}

async function getWhisperTranscriber() {
  if (state.ui.whisperTranscriber) return state.ui.whisperTranscriber;
  if (state.ui.whisperInitPromise) return state.ui.whisperInitPromise;

  state.ui.whisperStatus = "loading";
  updateRecordButton();
  state.ui.whisperInitPromise = (async () => {
    const { pipeline, env } = await import(TRANSFORMERS_JS_URL);
    env.allowLocalModels = false;
    env.useBrowserCache = true;
    const transcriber = await pipeline("automatic-speech-recognition", WHISPER_MODEL_ID);
    state.ui.whisperTranscriber = transcriber;
    state.ui.whisperStatus = "ready";
    return transcriber;
  })().catch((error) => {
    state.ui.whisperInitPromise = null;
    state.ui.whisperStatus = "error";
    throw error;
  });

  return state.ui.whisperInitPromise;
}

async function transcribeWhisperBlob(blob) {
  const context = getRecordingContext();
  const line = context?.line ?? null;
  state.ui.isTranscribing = true;
  updateRecordButton();
  setModeFeedback("Transcribing the recording now. This should be much more reliable than the old browser mic.", "neutral");

  try {
    const form = new FormData();
    form.append("file", blob, "recitation.webm");
    form.append("prompt", buildTranscriptionPrompt(line?.text ?? ""));
    const response = await fetch(OPENAI_STT_URL, {
      method: "POST",
      body: form,
    });
    const output = await response.json().catch(() => ({}));
    const rawTranscript = typeof output?.text === "string" ? output.text.trim() : "";
    if (!response.ok) {
      throw new Error(output?.openai?.error?.message ?? output?.error ?? "Speech transcription request failed.");
    }

    const bestTranscript = selectSpeechTranscript(rawTranscript ? [rawTranscript] : [], line?.text);
    const cleanedTranscript = rawTranscript ? cleanSpeechTranscript(rawTranscript, line?.text ?? "") : "";
    const transcript = bestTranscript || cleanedTranscript || rawTranscript;

    if (!transcript) {
      setModeFeedback("I heard the recording, but the line didn't come through clearly enough yet. Try again, or use a hint first.", "warning");
      return;
    }

    if (line) {
      const preview = evaluateAttempt(transcript, line.text, state.settings.strictnessLevel);
      const clearlyOffTarget =
        preview.score < 0.55
        || (preview.metrics?.overlapScore ?? 0) < 0.6
        || (preview.metrics?.orderedScore ?? 0) < 0.55;
      if (clearlyOffTarget) {
        setModeFeedback("That recording did not sound close enough to the poem line, so it was not filled in. Try again and say the words clearly.", "warning");
        return;
      }
    }

    if (context?.input) {
      context.input.value = transcript;
      context.input.dataset.inputSource = "speech";
    }
    if (line) {
      const preview = evaluateAttempt(transcript, line.text, state.settings.strictnessLevel);
      const tone = preview.outcome === "pass" ? "positive" : preview.outcome === "close" ? "warning" : "neutral";
      const message = preview.outcome === "pass"
        ? "The recording caught a strong match for the poem line. Press Check recitation to lock it in."
        : preview.outcome === "close"
          ? "The recording heard most of the line. Press Check recitation, or tidy the wording first."
          : "The recording caught part of it, but you may want to try that line again.";
      setModeFeedback(message, tone);
    } else {
      setModeFeedback("The recording heard your recitation. Press Check recitation when you're ready.", "neutral");
    }
  } catch (error) {
    console.warn("Cloud transcription failed.", error);
    setModeFeedback("The speech service could not finish this try. You can try the microphone again, or use a hint first.", "warning");
  } finally {
    state.ui.isTranscribing = false;
    updateRecordButton();
  }
}

function buildTranscriptionPrompt(expectedText) {
  const poemGlossary = [
    "Paul Revere",
    "churchyard",
    "night-wind",
    "belfry",
    "Somerset",
    "lantern",
    "steeple",
    "Middlesex",
    "Lexington",
    "Concord",
    "phantom ship",
  ];
  return [
    "This is a child reciting Henry Wadsworth Longfellow's poem Paul Revere's Ride.",
    "Keep unusual poem words intact instead of simplifying them into ordinary speech.",
    `Important poem words and phrases include: ${poemGlossary.join(", ")}.`,
  ].filter(Boolean).join(" ");
}

async function toggleAmbient() {
  state.ui.ambientEnabled = !state.ui.ambientEnabled;
  elements.ambientToggleBtn.setAttribute("aria-pressed", String(state.ui.ambientEnabled));
  elements.ambientToggleBtn.textContent = state.ui.ambientEnabled ? "Ambient on" : "Ambient off";

  if (!state.ui.ambientEnabled) {
    stopAmbient();
    return;
  }

  try {
    startAmbient();
    await state.ui.ambientAudio?.play();
    setFeedback(elements.storyFeedback, "Ambient soundtrack is on.", "positive");
  } catch {
    state.ui.ambientEnabled = false;
    elements.ambientToggleBtn.setAttribute("aria-pressed", "false");
    elements.ambientToggleBtn.textContent = "Ambient off";
    setFeedback(elements.storyFeedback, "Ambient music could not start until the browser allows audio playback.", "warning");
  }
}

function startAmbient() {
  if (!state.ui.ambientAudio) {
    const audio = new Audio("./content/assets/audio/ambient-night-ride.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.28;
    state.ui.ambientAudio = audio;
  }
  state.ui.ambientAudio.currentTime = state.ui.ambientAudio.currentTime || 0;
}

function stopAmbient() {
  if (!state.ui.ambientAudio) return;
  state.ui.ambientAudio.pause();
}

function toggleCadence() {
  state.ui.cadenceEnabled = !state.ui.cadenceEnabled;
  if (state.ui.cadenceEnabled) {
    startCadence();
  } else {
    stopCadence();
  }
  renderCadenceState();
}

function startCadence() {
  stopCadence();
  state.ui.cadenceBeat = 0;
  ensureAudioContext();
  tickCadence();
  state.ui.cadenceInterval = window.setInterval(tickCadence, 700);
}

function stopCadence() {
  if (state.ui.cadenceInterval) {
    window.clearInterval(state.ui.cadenceInterval);
    state.ui.cadenceInterval = null;
  }
  state.ui.cadenceBeat = 0;
  updateBeatDots();
}

function tickCadence() {
  state.ui.cadenceBeat = (state.ui.cadenceBeat % 4) + 1;
  updateBeatDots();
  if (!state.ui.cadenceEnabled || !state.settings.speechEnabled || !state.ui.audioContext) return;
  try {
    const osc = state.ui.audioContext.createOscillator();
    const gain = state.ui.audioContext.createGain();
    osc.type = state.ui.cadenceBeat === 1 ? "triangle" : "sine";
    osc.frequency.value = state.ui.cadenceBeat === 1 ? 392 : 262;
    gain.gain.value = state.ui.cadenceBeat === 1 ? 0.025 : 0.012;
    osc.connect(gain).connect(state.ui.audioContext.destination);
    osc.start();
    osc.stop(state.ui.audioContext.currentTime + 0.08);
  } catch {
    // Keep visual cadence if audio fails.
  }
}

function updateBeatDots() {
  elements.beatDots.forEach((dot, index) => {
    const beat = index + 1;
    const active = state.ui.cadenceEnabled && beat === state.ui.cadenceBeat;
    dot.classList.toggle("active", active);
    dot.classList.toggle("downbeat", active && beat === 1);
  });
}

function ensureAudioContext() {
  if (state.ui.audioContext) return state.ui.audioContext;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  state.ui.audioContext = new AudioContext();
  return state.ui.audioContext;
}

function startClock() {
  if (state.ui.clockTimer) {
    window.clearInterval(state.ui.clockTimer);
  }
  state.ui.clockTimer = window.setInterval(async () => {
    if (shouldRefreshTrustedClock()) {
      await syncTrustedClock();
    }
    renderDeadlineBanner();
  }, 60000);
}

function shouldRefreshTrustedClock() {
  if (!state.ui.lastCloudSyncIso) return true;
  const lastSync = new Date(state.ui.lastCloudSyncIso).getTime();
  return Number.isNaN(lastSync) || Date.now() - lastSync > 10 * 60 * 1000;
}

async function syncTrustedClock() {
  const apiUrl = state.scheduleConfig.scheduleTimezone?.timeApiUrl;
  if (!apiUrl) {
    state.ui.clockSource = "browser-fallback";
    state.ui.cloudTimeOffsetMs = 0;
    return;
  }
  try {
    const response = await fetch(apiUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Time API returned ${response.status}`);
    const data = await response.json();
    const trustedNow = new Date(data.datetime ?? data.utc_datetime);
    if (Number.isNaN(trustedNow.getTime())) throw new Error("Invalid datetime from time API");
    state.ui.cloudTimeOffsetMs = trustedNow.getTime() - Date.now();
    state.ui.lastCloudSyncIso = new Date().toISOString();
    state.ui.clockSource = "cloud";
  } catch (error) {
    console.warn("Falling back to browser clock for Phoenix countdown.", error);
    state.ui.cloudTimeOffsetMs = 0;
    state.ui.clockSource = "browser-fallback";
  }
}

function getPhoenixNow() {
  return new Date(Date.now() + (state.ui.cloudTimeOffsetMs ?? 0));
}

function getDueDateTime(dateString) {
  const offset = state.scheduleConfig.scheduleTimezone?.utcOffset ?? "-07:00";
  return new Date(`${dateString}T23:59:59${offset}`);
}

function buildClockMessage(now) {
  const sourceLabel = state.ui.clockSource === "cloud" ? "Phoenix cloud time" : "Browser fallback time";
  return `Right now in ${state.scheduleConfig.scheduleTimezone?.label ?? "Phoenix, AZ"}: ${formatDateTime(now)} (${sourceLabel})`;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: state.scheduleConfig.scheduleTimezone?.timeZoneId ?? "America/Phoenix",
  }).format(date);
}

function startAnimationLoop() {
  const step = () => {
    state.ui.chapterAnimationPhase += 0.015;
    state.ui.chapterTransition = Math.max(0, state.ui.chapterTransition - 0.035);
    if (state.ui.chapterTransition === 0) {
      state.ui.previousChapterId = null;
    }
    drawStoryScene();
    state.ui.animationFrame = window.requestAnimationFrame(step);
  };
  state.ui.animationFrame = window.requestAnimationFrame(step);
}

function drawStoryScene() {
  const chapter = getActiveChapter();
  if (!chapter || !elements.storyCanvas) return;

  const ctx = elements.storyCanvas.getContext("2d");
  if (!ctx) return;

  const width = elements.storyCanvas.width;
  const height = elements.storyCanvas.height;
  const ratio = window.devicePixelRatio || 1;
  const block = Math.max(7 * ratio, Math.floor(width / 60));
  const t = state.ui.chapterAnimationPhase;

  ctx.clearRect(0, 0, width, height);
  const previousChapter = getChapterById(state.ui.previousChapterId);
  if (previousChapter && state.ui.chapterTransition > 0) {
    drawSceneComposition(ctx, previousChapter, width, height, block, t, 1);
  }

  ctx.save();
  if (previousChapter && state.ui.chapterTransition > 0) {
    ctx.globalAlpha = 1 - easeOutCubic(state.ui.chapterTransition);
  }
  drawSceneComposition(ctx, chapter, width, height, block, t, 1 - state.ui.chapterTransition);
  ctx.restore();

  if (state.ui.chapterTransition > 0) {
    drawPageTurnOverlay(ctx, width, height, easeOutCubic(state.ui.chapterTransition));
  }
}

function drawSceneComposition(ctx, chapter, width, height, block, t, transitionMix) {
  const profile = getSceneProfile(chapter);
  drawSky(ctx, width, height, profile.skyTop, profile.skyBottom);
  drawStars(ctx, width, height, block, profile.starField);
  drawMoon(ctx, width, height, block, profile.moon);
  drawFog(ctx, width, height, t, profile.fogBands);

  if (profile.scene === "churchyard-close") drawChurchyardClose(ctx, width, height, block, t);
  if (profile.scene === "wind-sweep") drawWindSweep(ctx, width, height, block, t);
  if (profile.scene === "bay-reveal") drawBayReveal(ctx, width, height, block, t);
  if (profile.scene === "horse-prep") drawHorsePrepSpread(ctx, width, height, block, t);
  if (profile.scene === "tower-focus") drawTowerFocusSpread(ctx, width, height, block, t);

  drawSceneFrame(ctx, width, height, block, chapter, profile, transitionMix);
}

function getSceneProfile(chapter) {
  const profiles = {
    "churchyard-watch": { scene: "churchyard-close", skyTop: "#173b62", skyBottom: "#08111d", starField: [[0.1, 0.16], [0.16, 0.22], [0.25, 0.18], [0.36, 0.14], [0.57, 0.16], [0.73, 0.11]], moon: { x: 0.79, y: 0.12, size: 4.9, glow: 7.2 }, fogBands: [[0.04, 0.28, 0.7, 36], [0.18, 0.51, 0.66, 46]], focusLabel: "The graves below the tower" },
    "whispering-wind": { scene: "wind-sweep", skyTop: "#1b4169", skyBottom: "#08111d", starField: [[0.08, 0.18], [0.14, 0.25], [0.22, 0.15], [0.41, 0.13], [0.55, 0.19], [0.68, 0.12], [0.82, 0.16]], moon: { x: 0.73, y: 0.13, size: 4.4, glow: 6.7 }, fogBands: [[0.02, 0.36, 0.8, 34], [0.22, 0.59, 0.72, 42]], focusLabel: "The wind moves like a whispering guard" },
    "moonrise-bay": { scene: "bay-reveal", skyTop: "#163d64", skyBottom: "#06101b", starField: [[0.06, 0.14], [0.14, 0.19], [0.27, 0.13], [0.39, 0.16], [0.53, 0.1], [0.67, 0.18], [0.8, 0.14]], moon: { x: 0.84, y: 0.12, size: 5.4, glow: 8.4 }, fogBands: [[0.12, 0.33, 0.9, 28], [0.18, 0.56, 0.78, 36]], focusLabel: "The bay opens and the bridge of boats appears" },
    "ride-prep": { scene: "horse-prep", skyTop: "#18395e", skyBottom: "#07101b", starField: [[0.11, 0.15], [0.18, 0.23], [0.28, 0.17], [0.49, 0.15], [0.64, 0.12], [0.79, 0.18]], moon: { x: 0.84, y: 0.11, size: 4.9, glow: 7.2 }, fogBands: [[0.06, 0.34, 0.76, 30], [0.31, 0.62, 0.62, 38]], focusLabel: "Paul Revere and the horse wait on the shore" },
    "tower-watch": { scene: "tower-focus", skyTop: "#17395a", skyBottom: "#07101b", starField: [[0.11, 0.14], [0.2, 0.18], [0.31, 0.12], [0.56, 0.13], [0.68, 0.16], [0.79, 0.1]], moon: { x: 0.16, y: 0.12, size: 4.6, glow: 7.1 }, fogBands: [[0.1, 0.4, 0.7, 30], [0.28, 0.58, 0.56, 36]], focusLabel: "All eyes on the belfry signal" },
  };
  return profiles[chapter.id] ?? profiles["churchyard-watch"];
}

function getChapterById(chapterId) {
  if (!chapterId) return null;
  return getActiveChapters().find((chapter) => chapter.id === chapterId) ?? null;
}

function drawSky(ctx, width, height, top, bottom) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, top);
  sky.addColorStop(0.66, mixColor(top, bottom, 0.55));
  sky.addColorStop(1, bottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height, block, stars) {
  ctx.fillStyle = "rgba(235, 244, 255, 0.82)";
  stars.forEach(([x, y], index) => {
    const size = index % 2 ? block * 0.28 : block * 0.18;
    ctx.fillRect(width * x, height * y, size, size);
  });
}

function drawMoon(ctx, width, height, block, moon) {
  ctx.fillStyle = "#f4df9a";
  ctx.fillRect(width * moon.x, height * moon.y, block * moon.size, block * moon.size);
  ctx.fillStyle = "rgba(255, 226, 150, 0.18)";
  ctx.fillRect(width * moon.x - block, height * moon.y - block, block * moon.glow, block * moon.glow);
}

function drawFog(ctx, width, height, t, bands) {
  ctx.fillStyle = "rgba(207, 224, 247, 0.08)";
  const fogX = ((Math.sin(t) + 1) / 2) * 60;
  bands.forEach(([x, y, w, h], index) => {
    const drift = index % 2 === 0 ? fogX : -fogX * 0.45;
    ctx.fillRect(width * x + drift - 30, height * y, width * w, h);
  });
}

function drawGroundPlane(ctx, width, height, top, bottom, horizon = 0.68) {
  const groundTop = height * horizon;
  const ground = ctx.createLinearGradient(0, groundTop, 0, height);
  ground.addColorStop(0, top);
  ground.addColorStop(1, bottom);
  ctx.fillStyle = ground;
  ctx.fillRect(0, groundTop, width, height - groundTop);
}

function drawWater(ctx, width, height, block, t, waterTop, topColor, bottomColor) {
  const water = ctx.createLinearGradient(0, waterTop, 0, height);
  water.addColorStop(0, topColor);
  water.addColorStop(1, bottomColor);
  ctx.fillStyle = water;
  ctx.fillRect(0, waterTop, width, height - waterTop);
  ctx.fillStyle = "rgba(194, 225, 255, 0.16)";
  for (let x = -block; x < width + block; x += block * 2) {
    ctx.fillRect(x + ((Math.sin(t + x * 0.01) + 1) * block) / 3, waterTop + block * 0.35, block, block * 0.22);
  }
}

function drawRooftops(ctx, width, height, block, houses, bodyA = "#24354a", bodyB = "#1b2a3d") {
  houses.forEach(([x, y, w, h], index) => {
    const px = width * x;
    const py = height * y;
    ctx.fillStyle = index % 2 ? bodyA : bodyB;
    ctx.fillRect(px, py, block * w, block * h);
    ctx.fillStyle = "#131d29";
    for (let row = 0; row < 3; row += 1) {
      ctx.fillRect(px + row * block, py - (row + 1) * block, block * Math.max(2, w - row * 2), block);
    }
  });
}

function drawChurch(ctx, width, height, block, options) {
  const x = width * options.x;
  const y = height * options.y;
  ctx.fillStyle = options.bodyColor ?? "#46556b";
  ctx.fillRect(x, y + block * 5, block * options.bodyWidth, block * options.bodyHeight);
  ctx.fillStyle = options.towerColor ?? "#61748d";
  ctx.fillRect(x + block * options.towerOffsetX, y, block * options.towerWidth, block * options.towerHeight);
  ctx.fillStyle = "#24313f";
  ctx.fillRect(x + block * (options.towerOffsetX - 0.1), y - block, block * (options.towerWidth + 0.2), block);
  ctx.fillRect(x + block * (options.towerOffsetX + 1.1), y - block * 2, block * 2, block);
  ctx.fillRect(x + block * (options.towerOffsetX + 1.8), y - block * options.spireHeight, block * 1.1, block * (options.spireHeight - 2));
  ctx.fillStyle = options.lit ? "#ffd873" : "rgba(255, 216, 115, 0.12)";
  ctx.fillRect(x + block * options.windowX, y + block * options.windowY, block * 1.55, block * 1.8);
}

function drawGraves(ctx, width, height, block, graves, color = "#5a6a7a") {
  ctx.fillStyle = color;
  graves.forEach(([x, y, h, widthBlocks = 1]) => {
    const px = width * x;
    const py = height * y;
    ctx.fillRect(px, py - h * block, block * widthBlocks, h * block);
    ctx.fillRect(px - block * 0.12, py - h * block - block * 0.45, block * (widthBlocks + 0.24), block * 0.55);
  });
}

function drawTrees(ctx, width, height, block, trees) {
  trees.forEach(([x, y, crown]) => {
    const px = width * x;
    const py = height * y;
    ctx.fillStyle = "#3b291e";
    ctx.fillRect(px, py, block, block * 3);
    ctx.fillStyle = "#234534";
    for (let row = 0; row < crown; row += 1) {
      const widthBlocks = crown - row;
      ctx.fillRect(px - widthBlocks * block * 0.5, py - (row + 1) * block, widthBlocks * block, block);
    }
  });
}

function drawHorse(ctx, width, height, block, horse) {
  const x = width * horse.x;
  const y = height * horse.y;
  ctx.fillStyle = horse.color ?? "#2a1e18";
  ctx.fillRect(x, y, block * horse.scale * 3.2, block * horse.scale);
  ctx.fillRect(x + block * horse.scale * 0.8, y - block * horse.scale, block * horse.scale * 1.8, block * horse.scale);
  ctx.fillRect(x + block * horse.scale * 2.4, y - block * horse.scale * 1.7, block * horse.scale, block * horse.scale * 1.4);
  ctx.fillRect(x + block * horse.scale * 0.4, y + block * horse.scale, block * horse.scale * 0.5, block * horse.scale * 2);
  ctx.fillRect(x + block * horse.scale * 2.25, y + block * horse.scale, block * horse.scale * 0.5, block * horse.scale * 2);
}

function drawChurchyardClose(ctx, width, height, block, t) {
  drawGroundPlane(ctx, width, height, "#32485d", "#0b1118", 0.66);
  drawRooftops(ctx, width, height, block, [[0.05, 0.58, 8, 5], [0.66, 0.57, 9, 6]], "#233549", "#1a2939");
  drawTrees(ctx, width, height, block, [[0.12, 0.64, 5], [0.83, 0.62, 4]]);
  drawChurch(ctx, width, height, block, { x: 0.66, y: 0.23, bodyWidth: 8.5, bodyHeight: 9, towerOffsetX: 2, towerWidth: 4.2, towerHeight: 14, spireHeight: 5, windowX: 3.55, windowY: 1.5, lit: false });
  drawGraves(ctx, width, height, block, [[0.14, 0.78, 4], [0.21, 0.76, 3], [0.28, 0.79, 4], [0.35, 0.77, 3], [0.42, 0.79, 4], [0.49, 0.76, 3]]);
  ctx.fillStyle = "rgba(255, 222, 165, 0.75)";
  ctx.fillRect(width * 0.55, height * (0.34 + Math.sin(t * 1.2) * 0.01), block * 0.7, block * 0.7);
}

function drawWindSweep(ctx, width, height, block, t) {
  drawGroundPlane(ctx, width, height, "#2b4356", "#091018", 0.65);
  drawRooftops(ctx, width, height, block, [[0.03, 0.59, 9, 5], [0.61, 0.61, 11, 5]], "#213244", "#172433");
  drawTrees(ctx, width, height, block, [[0.1, 0.66, 4], [0.22, 0.63, 5], [0.87, 0.65, 4]]);
  drawChurch(ctx, width, height, block, { x: 0.63, y: 0.24, bodyWidth: 8.5, bodyHeight: 8.5, towerOffsetX: 2.2, towerWidth: 4, towerHeight: 13.5, spireHeight: 5, windowX: 3.65, windowY: 1.6, lit: false });
  drawGraves(ctx, width, height, block, [[0.16, 0.8, 3], [0.23, 0.77, 2], [0.3, 0.79, 3], [0.38, 0.78, 2], [0.46, 0.8, 3], [0.54, 0.79, 2]]);
  ctx.strokeStyle = "rgba(188, 225, 255, 0.35)";
  ctx.lineWidth = Math.max(2, block * 0.2);
  for (let index = 0; index < 3; index += 1) {
    const y = height * (0.42 + index * 0.08);
    const sway = Math.sin(t * 1.8 + index) * block * 2.4;
    ctx.beginPath();
    ctx.moveTo(width * 0.06, y);
    ctx.bezierCurveTo(width * 0.22, y - block * 1.2, width * 0.4, y + sway, width * 0.61, y - block * 0.4);
    ctx.bezierCurveTo(width * 0.73, y - block, width * 0.83, y + block * 0.8, width * 0.92, y - block * 0.1);
    ctx.stroke();
  }
}

function drawBayReveal(ctx, width, height, block, t) {
  const waterTop = height * 0.63;
  drawWater(ctx, width, height, block, t, waterTop, "rgba(76, 142, 184, 0.9)", "rgba(10, 32, 51, 0.96)");
  drawRooftops(ctx, width, height, block, [[0.01, 0.57, 7, 5], [0.12, 0.61, 7, 4], [0.7, 0.58, 10, 5]], "#22364b", "#182636");
  drawTrees(ctx, width, height, block, [[0.09, 0.59, 4], [0.89, 0.62, 5]]);
  drawChurch(ctx, width, height, block, { x: 0.74, y: 0.22, bodyWidth: 7.2, bodyHeight: 8, towerOffsetX: 1.6, towerWidth: 3.6, towerHeight: 12.6, spireHeight: 5, windowX: 2.95, windowY: 1.7, lit: false });
  ctx.fillStyle = "#101721";
  ctx.fillRect(width * 0.14, waterTop - block * 2.8, block * 16, block * 1.2);
  ctx.fillRect(width * 0.19, waterTop - block * 3.8, block * 15, block * 0.9);
  for (let index = 0; index < 7; index += 1) {
    ctx.fillRect(width * (0.16 + index * 0.06), waterTop - block * (4.8 + (index % 2) * 0.6), block * 0.9, block * 3.4);
  }
  ctx.fillStyle = "rgba(255, 215, 122, 0.88)";
  ctx.fillRect(width * 0.19, waterTop - block * 0.4, block, block * 0.6);
  ctx.fillRect(width * 0.25, waterTop - block * 0.42, block, block * 0.6);
}

function drawHorsePrepSpread(ctx, width, height, block, t) {
  drawGroundPlane(ctx, width, height, "#334d63", "#101923", 0.68);
  drawWater(ctx, width, height, block, t, height * 0.7, "rgba(72, 134, 171, 0.62)", "rgba(10, 25, 41, 0.82)");
  drawRooftops(ctx, width, height, block, [[0.02, 0.58, 8, 5], [0.77, 0.6, 8, 5]], "#223548", "#1a2736");
  drawTrees(ctx, width, height, block, [[0.14, 0.62, 5], [0.84, 0.65, 4]]);
  drawHorse(ctx, width, height, block, { x: 0.54, y: 0.68, scale: 1.6, color: "#2f2119" });
  ctx.fillStyle = "#3f5467";
  ctx.fillRect(width * 0.63, height * 0.56, block * 1.1, block * 4.2);
  ctx.fillStyle = "#d2b67d";
  ctx.fillRect(width * 0.62, height * 0.61, block * 0.75, block * 0.75);
  ctx.fillStyle = "#22374a";
  ctx.fillRect(width * 0.69, height * 0.48, block * 6, block * 7);
}

function drawTowerFocusSpread(ctx, width, height, block, t) {
  drawGroundPlane(ctx, width, height, "#30485f", "#0b131c", 0.72);
  drawRooftops(ctx, width, height, block, [[0.02, 0.61, 9, 5], [0.21, 0.63, 8, 4], [0.72, 0.62, 10, 4]], "#203344", "#152130");
  drawTrees(ctx, width, height, block, [[0.09, 0.67, 4], [0.88, 0.66, 5]]);
  drawChurch(ctx, width, height, block, { x: 0.4, y: 0.1, bodyWidth: 10.4, bodyHeight: 12.5, towerOffsetX: 2.8, towerWidth: 5.3, towerHeight: 18.5, spireHeight: 7, windowX: 4.6, windowY: 2.4, lit: true, bodyColor: "#4d6078", towerColor: "#70839c" });
  ctx.fillStyle = "rgba(255, 218, 122, 0.92)";
  ctx.fillRect(width * 0.55, height * 0.2, block * 1.1, block * 1.1);
  ctx.fillStyle = "#f0d889";
  ctx.fillRect(width * 0.18, height * 0.75, block * 0.9, block * 0.9);
  ctx.fillRect(width * 0.24, height * 0.75, block * 0.9, block * 0.9);
  ctx.strokeStyle = "rgba(255, 222, 165, 0.18)";
  ctx.lineWidth = Math.max(2, block * 0.18);
  ctx.beginPath();
  ctx.moveTo(width * 0.22, height * 0.76);
  ctx.lineTo(width * 0.55, height * 0.22);
  ctx.stroke();
}

function drawSceneFrame(ctx, width, height, block, chapter, profile, transitionMix) {
  const vignette = ctx.createLinearGradient(0, height * 0.55, 0, height);
  vignette.addColorStop(0, "rgba(4, 8, 15, 0)");
  vignette.addColorStop(1, "rgba(4, 8, 15, 0.56)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(4, 10, 18, 0.42)";
  ctx.fillRect(block, block, width * 0.32, block * 4.2);
  ctx.fillStyle = "#eef7ff";
  ctx.font = `${Math.max(16, block * 0.9)}px sans-serif`;
  ctx.fillText(chapter.title, block * 1.8, block * 3.2);
  ctx.fillStyle = "rgba(255, 227, 169, 0.92)";
  ctx.font = `${Math.max(10, block * 0.45)}px sans-serif`;
  ctx.fillText(profile.focusLabel, block * 1.8, block * 4.4);
  if (transitionMix > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.06 * transitionMix})`;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawPageTurnOverlay(ctx, width, height, amount) {
  const curtainWidth = width * amount * 0.3;
  const curtain = ctx.createLinearGradient(width - curtainWidth, 0, width, 0);
  curtain.addColorStop(0, "rgba(9, 18, 29, 0)");
  curtain.addColorStop(1, "rgba(9, 18, 29, 0.72)");
  ctx.fillStyle = curtain;
  ctx.fillRect(width - curtainWidth, 0, curtainWidth, height);
  ctx.fillStyle = `rgba(255, 241, 212, ${0.18 * amount})`;
  ctx.fillRect(width - curtainWidth * 0.12, 0, curtainWidth * 0.12, height);
}

function easeOutCubic(value) {
  return 1 - ((1 - value) ** 3);
}

function mixColor(a, b, amount) {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const mix = (start, end) => Math.round(start + (end - start) * amount);
  return `rgb(${mix(ar, br)}, ${mix(ag, bg)}, ${mix(ab, bb)})`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((char) => `${char}${char}`).join("") : clean;
  return [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16));
}

function normalizePasskey(value) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 40);
}

function setCloudFeedback(message, tone = "neutral") {
  if (!elements.cloudSaveFeedback) return;
  setFeedback(elements.cloudSaveFeedback, message, tone);
}

function buildCloudPayload(passkey) {
  return {
    passkey,
    savedAt: new Date().toISOString(),
    settings: state.settings,
    progress: state.progress,
  };
}

async function saveCloudProgress() {
  const passkey = normalizePasskey(elements.cloudPasskeyInput.value);
  if (!passkey) {
    setCloudFeedback("Add a cloud passkey first so this child can load the same progress somewhere else.", "warning");
    return;
  }

  state.settings.cloudPasskey = passkey;
  elements.cloudPasskeyInput.value = passkey;
  saveSettings();
  setCloudFeedback("Saving progress to the cloud...", "neutral");

  try {
    const response = await fetch(CLOUD_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildCloudPayload(passkey)),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      throw new Error(data?.error ?? data?.message ?? "Cloud save failed.");
    }
    setCloudFeedback(`Cloud save complete for passkey "${passkey}".`, "positive");
  } catch (error) {
    console.warn("Cloud save failed.", error);
    setCloudFeedback("Cloud save did not work yet. The local device save is still safe.", "warning");
  }
}

async function loadCloudProgress() {
  const passkey = normalizePasskey(elements.cloudPasskeyInput.value);
  if (!passkey) {
    setCloudFeedback("Enter the child's cloud passkey first, then load the saved progress.", "warning");
    return;
  }

  state.settings.cloudPasskey = passkey;
  elements.cloudPasskeyInput.value = passkey;
  saveSettings();
  setCloudFeedback("Loading progress from the cloud...", "neutral");

  try {
    const response = await fetch(CLOUD_LOAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data?.ok === false) {
      throw new Error(data?.error ?? data?.message ?? "Cloud load failed.");
    }

    if (data.settings) {
      state.settings = { ...state.settings, ...data.settings, cloudPasskey: passkey };
      saveSettings();
    }
    if (data.progress) {
      state.progress = data.progress;
      saveProgress();
    }

    ensureProgressShape();
    render();
    setCloudFeedback(`Cloud progress loaded for passkey "${passkey}".`, "positive");
  } catch (error) {
    console.warn("Cloud load failed.", error);
    setCloudFeedback("No cloud save was found for that passkey yet, or the cloud service is not ready.", "warning");
  }
}

function exportProgress() {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), settings: state.settings, progress: state.progress }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lantern-quest-progress.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importProgress(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (imported.settings) {
        state.settings = { ...state.settings, ...imported.settings };
        saveSettings();
      }
      if (imported.progress) {
        state.progress = imported.progress;
        saveProgress();
      }
      ensureProgressShape();
      render();
    } catch {
      setFeedback(elements.storyFeedback, "That file did not look like a Lantern Quest progress export.", "negative");
    }
  };
  reader.readAsText(file);
}

function resetProgress() {
  if (!window.confirm("Reset all saved progress for this browser?")) return;
  state.progress = { sections: {} };
  saveProgress();
  ensureProgressShape();
  render();
}

function setFeedback(element, message, tone) {
  element.textContent = message;
  element.className = `feedback-box ${tone}`;
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function handleFatalStartupError(error) {
  const message = `Startup failed: ${error?.message ?? "unknown error"}`;
  console.error(message, error);
  if (elements.prefaceTitle) {
    elements.prefaceTitle.textContent = "Storybook failed to start";
  }
  if (elements.prefaceHook) {
    elements.prefaceHook.textContent = message;
  }
  if (elements.prefaceSignificance) {
    elements.prefaceSignificance.textContent = "Refresh the page. If that does not help, clear saved Lantern Quest data for this browser and reload.";
  }
  if (elements.storyFeedback) {
    setFeedback(elements.storyFeedback, message, "negative");
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[—–-]/g, " ")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\b(o)\s+er\b/g, "oer")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-z0-9']/g, "");
}

function highlightKeywords(text, keywords) {
  if (!keywords.length) return escapeHtml(text);
  const escapedKeywords = keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escapedKeywords.join("|")})\\b`, "gi");
  return escapeHtml(text).replace(pattern, '<span class="highlight-word">$1</span>');
}

function wordOverlap(answerWords, targetWords) {
  const targetCounts = new Map();
  targetWords.forEach((word) => targetCounts.set(word, (targetCounts.get(word) ?? 0) + 1));
  let matched = 0;
  answerWords.forEach((word) => {
    const remaining = targetCounts.get(word) ?? 0;
    if (remaining > 0) {
      matched += 1;
      targetCounts.set(word, remaining - 1);
    }
  });
  return targetWords.length ? matched / targetWords.length : 0;
}

function orderedMatchScore(answerWords, targetWords) {
  return targetWords.length ? longestCommonSubsequence(answerWords, targetWords) / targetWords.length : 0;
}

function contentCoverage(answerWords, contentWords) {
  const answerSet = new Set(answerWords);
  return contentWords.filter((word) => answerSet.has(word)).length / Math.max(contentWords.length, 1);
}

function edgeWordScore(answerWords, targetWords) {
  if (!targetWords.length) return 1;
  let score = 0;
  if (answerWords[0] === targetWords[0]) score += 0.5;
  if (answerWords.at(-1) === targetWords.at(-1)) score += 0.5;
  return score;
}

function levenshtein(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, index) => [index]);
  for (let col = 1; col <= b.length; col += 1) rows[0][col] = col;
  for (let row = 1; row <= a.length; row += 1) {
    for (let col = 1; col <= b.length; col += 1) {
      const cost = a[row - 1] === b[col - 1] ? 0 : 1;
      rows[row][col] = Math.min(
        rows[row - 1][col] + 1,
        rows[row][col - 1] + 1,
        rows[row - 1][col - 1] + cost,
      );
    }
  }
  return rows[a.length][b.length];
}

function longestCommonSubsequence(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array.from({ length: b.length + 1 }, () => 0));
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1] + 1
        : Math.max(matrix[i - 1][j], matrix[i][j - 1]);
    }
  }
  return matrix[a.length][b.length];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function safelyParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSpeechSupport() {
  const micAvailable = Boolean(state.ui.speechRecognition);
  const voiceLabel = getSpeechVoiceStatusLabel();
  elements.speechSupportPill.textContent = micAvailable ? `Speech ready • ${voiceLabel}` : `Typing fallback • ${voiceLabel}`;
}

async function speakLines(lines) {
  if (!state.settings.speechEnabled) return;
  const text = lines.map((line) => line.text).join(" ");
  stopSpeechPlayback();

  if (shouldUseOpenAITTS()) {
    try {
      await speakLinesWithOpenAITTS(text);
      return;
    } catch (error) {
      console.warn("OpenAI TTS failed, falling back to browser speech.", error);
      state.ui.openAiTtsStatus = "error";
      renderSpeechSupport();
    }
  }

  if (shouldUseKokoro()) {
    try {
      await speakLinesWithKokoro(text);
      return;
    } catch (error) {
      console.warn("Kokoro failed, falling back to browser speech.", error);
      state.ui.kokoroStatus = "error";
      renderSpeechSupport();
    }
  }

  speakLinesWithBrowserVoice(text);
}

function getPreferredVoice() {
  const voices = state.ui.availableVoices.length ? state.ui.availableVoices : (window.speechSynthesis?.getVoices?.() ?? []);
  if (!voices.length) return null;

  if (state.settings.preferredVoiceURI
    && !["auto", "browser:auto", "openai:verse"].includes(state.settings.preferredVoiceURI)
    && !state.settings.preferredVoiceURI.startsWith("kokoro:")) {
    return voices.find((voice) => voice.voiceURI === state.settings.preferredVoiceURI) ?? null;
  }

  const englishVoices = voices.filter((voice) => /^en(-|_|$)/i.test(voice.lang ?? "") || /english/i.test(voice.name));
  const rankedNames = [
    /aria/i,
    /jenny/i,
    /guy/i,
    /ava/i,
    /samantha/i,
    /daniel/i,
    /google us english/i,
    /microsoft.*natural/i,
    /natural/i,
    /zira/i,
  ];

  for (const pattern of rankedNames) {
    const match = englishVoices.find((voice) => pattern.test(voice.name));
    if (match) return match;
  }

  return englishVoices[0] ?? voices[0] ?? null;
}

function shouldUseOpenAITTS() {
  const preference = state.settings?.preferredVoiceURI ?? "openai:verse";
  return preference === "openai:verse";
}

function shouldUseKokoro() {
  const preference = state.settings?.preferredVoiceURI ?? "openai:verse";
  return preference === "auto" || preference.startsWith("kokoro:");
}

function getPreferredKokoroVoiceId() {
  const preference = state.settings?.preferredVoiceURI ?? "auto";
  return preference.startsWith("kokoro:") ? preference.slice("kokoro:".length) : "af_bella";
}

function getKokoroVoiceLabel(voiceId) {
  return KOKORO_VOICE_LABELS[voiceId] ?? voiceId;
}

function getSpeechVoiceStatusLabel() {
  if (shouldUseOpenAITTS()) {
    if (state.ui.openAiTtsStatus === "ready") return "OpenAI voice: Verse";
    if (state.ui.openAiTtsStatus === "loading") return "OpenAI voice: Verse (loading)";
    if (state.ui.openAiTtsStatus === "error") {
      const browserVoice = getPreferredVoice();
      return `OpenAI voice: Verse (fallback: ${browserVoice?.name ?? "browser voice"})`;
    }
    return "OpenAI voice: Verse (stand by)";
  }

  if (shouldUseKokoro()) {
    const label = `Neural voice: ${getKokoroVoiceLabel(getPreferredKokoroVoiceId())}`;
    if (state.ui.kokoroStatus === "ready") return label;
    if (state.ui.kokoroStatus === "loading") return `${label} (loading)`;
    if (state.ui.kokoroStatus === "error") {
      const browserVoice = getPreferredVoice();
      return `${label} (fallback: ${browserVoice?.name ?? "browser voice"})`;
    }
    return `${label} (stand by)`;
  }

  const browserVoice = getPreferredVoice();
  return browserVoice ? `Browser voice: ${browserVoice.name}` : "Browser voice loading";
}

function stopSpeechPlayback() {
  window.speechSynthesis?.cancel?.();
  if (state.ui.neuralAudio) {
    state.ui.neuralAudio.pause();
    state.ui.neuralAudio = null;
  }
  if (state.ui.neuralAudioUrl) {
    URL.revokeObjectURL(state.ui.neuralAudioUrl);
    state.ui.neuralAudioUrl = null;
  }
}

async function speakLinesWithOpenAITTS(text) {
  state.ui.openAiTtsStatus = "loading";
  renderSpeechSupport();
  const response = await fetch(OPENAI_TTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice: OPENAI_TTS_DEFAULTS.voice,
      model: OPENAI_TTS_DEFAULTS.model,
      instructions: OPENAI_TTS_DEFAULTS.instructions,
      response_format: OPENAI_TTS_DEFAULTS.response_format,
    }),
  });

  const data = await response.json().catch(() => ({}));
  const audioUrl = data?.audioFile ?? data?.openai?.audioFile ?? data?.url ?? null;
  if (!response.ok || !audioUrl) {
    throw new Error(data?.openai?.error?.message ?? data?.error ?? "OpenAI TTS did not return an audio file.");
  }

  state.ui.neuralAudio = new Audio(audioUrl);
  state.ui.openAiTtsStatus = "ready";
  renderSpeechSupport();
  await state.ui.neuralAudio.play();
}

function warmHeadTTS() {
  if (!state.settings?.speechEnabled || !shouldUseKokoro()) return;
  getKokoroTTS().catch((error) => {
    console.warn("Kokoro warmup failed.", error);
  });
}

async function getKokoroTTS() {
  if (state.ui.kokoroTts) return state.ui.kokoroTts;
  if (state.ui.kokoroInitPromise) return state.ui.kokoroInitPromise;

  state.ui.kokoroStatus = "loading";
  renderSpeechSupport();
  state.ui.kokoroInitPromise = (async () => {
    const { KokoroTTS } = await import(KOKORO_JS_URL);
    const kokoro = await KokoroTTS.from_pretrained(KOKORO_MODEL_ID, {
      dtype: "q8",
      device: typeof navigator !== "undefined" && navigator.gpu ? "webgpu" : "wasm",
    });
    state.ui.kokoroTts = kokoro;
    state.ui.kokoroStatus = "ready";
    renderSpeechSupport();
    return kokoro;
  })().catch((error) => {
    state.ui.kokoroInitPromise = null;
    state.ui.kokoroStatus = "error";
    renderSpeechSupport();
    throw error;
  });

  return state.ui.kokoroInitPromise;
}

async function speakLinesWithKokoro(text) {
  const kokoro = await getKokoroTTS();
  const generated = await kokoro.generate(text, {
    voice: getPreferredKokoroVoiceId(),
    speed: 1,
  });

  if (generated && typeof generated.play === "function") {
    await generated.play();
    return;
  }

  const audioBlob = extractKokoroAudioBlob(generated);
  if (!audioBlob) {
    throw new Error("Kokoro returned no playable audio output.");
  }

  state.ui.neuralAudioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(state.ui.neuralAudioUrl);
  state.ui.neuralAudio = audio;
  audio.onended = () => {
    if (state.ui.neuralAudioUrl) {
      URL.revokeObjectURL(state.ui.neuralAudioUrl);
      state.ui.neuralAudioUrl = null;
    }
    state.ui.neuralAudio = null;
  };
  await audio.play();
}

function extractKokoroAudioBlob(generated) {
  if (!generated) return null;
  if (generated instanceof Blob) return generated;
  if (generated.audio instanceof Blob) return generated.audio;
  if (generated.wav instanceof Blob) return generated.wav;

  const audioArray = generated.audio ?? generated.data ?? generated.samples ?? null;
  const sampleRate = generated.sampling_rate ?? generated.sampleRate ?? 24000;
  if (audioArray && (audioArray instanceof Float32Array || Array.isArray(audioArray))) {
    return float32ToWavBlob(audioArray, sampleRate);
  }
  return null;
}

function float32ToWavBlob(audioArray, sampleRate) {
  const float32 = audioArray instanceof Float32Array ? audioArray : Float32Array.from(audioArray);
  const buffer = new ArrayBuffer(44 + float32.length * 2);
  const view = new DataView(buffer);
  writeWavString(view, 0, "RIFF");
  view.setUint32(4, 36 + float32.length * 2, true);
  writeWavString(view, 8, "WAVE");
  writeWavString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeWavString(view, 36, "data");
  view.setUint32(40, float32.length * 2, true);

  let offset = 44;
  for (let i = 0; i < float32.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeWavString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function speakLinesWithBrowserVoice(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getPreferredVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

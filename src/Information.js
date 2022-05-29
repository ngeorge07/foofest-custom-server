//var faker = require("faker");
const bands = require("./static/bands.json");
const { shuffle } = require("./util/shuffle");
const { numberToTime } = require("./util/numberToTime");
const { rndBetween, rndBetweenEven } = require("./util/rnd");
const { observer } = require("./util/observer");
const { events } = require("./util/events");

class Information {
  constructor(fest) {
    //TODO: ? flatten array and add stage/day?

    this.fest = fest;

    this.scenes = ["Midgard", "Vanaheim", "Jotunheim"];
    this.days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    this.slots = {};
    this.scenes.forEach((scene) => {
      this.slots[scene] = this._setEmptyStage();
    });
    this.fillSlots();
    this.tick.bind(this);
    observer.subscribe(events.TICK, () => this.tick());
  }

  tick() {
    if (Math.random() * 100 < this.fest.eventChance) {
      const scene = this.scenes[rndBetween(0, this.scenes.length - 1)];
      const day = this.days[rndBetween(0, this.days.length - 1)];
      const slot = rndBetweenEven(0, 10);

      if (!this.slots[scene][day][slot].cancelled) {
        this.slots[scene][day][slot].cancelled = true;
        observer.publish(events.CANCELLATION, {
          scene,
          day,
          act: this.slots[scene][day][slot],
        }); //TODO args, which event
        this.slots[scene][day][slot].cancelled = true;
      }
    }
  }

  _setEmptyStage() {
    const temp = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    };
    return temp;
  }

  fillSlots() {
    const copy = bands.map((band) => band);
    shuffle(copy.slice(16, 126));

    this._fillStage(this.scenes[0], copy.slice(0, 42));
    this._fillStage(this.scenes[1], copy.slice(42, 84));
    this._fillStage(this.scenes[2], copy.slice(84, 126));
  }

  _fillStage(stage, acts) {
    this.slots[stage].mon = this._addBreaks(acts.slice(0, 6), stage, "Monday");
    this.slots[stage].tue = this._addBreaks(
      acts.slice(6, 12),
      stage,
      "Tuesday"
    );
    this.slots[stage].wed = this._addBreaks(
      acts.slice(12, 18),
      stage,
      "Wednesday"
    );
    this.slots[stage].thu = this._addBreaks(
      acts.slice(18, 24),
      stage,
      "Thursday"
    );
    this.slots[stage].fri = this._addBreaks(
      acts.slice(24, 30),
      stage,
      "Friday"
    );
    this.slots[stage].sat = this._addBreaks(
      acts.slice(30, 36),
      stage,
      "Saturday"
    );
    this.slots[stage].sun = this._addBreaks(
      acts.slice(36, 42),
      stage,
      "Sunday"
    );

    //console.dir(this.slots);
  }

  _addBreaks(acts, stage, day) {
    const nextActs = [];
    let start = 0;
    acts.forEach((act) => {
      let color;
      let runeUrl;
      let logo;

      if (act.stage ? act.stage === "Midgard" : stage === "Midgard") {
        color = "accent_red";
        runeUrl = "midgard.svg";
      } else if (act.stage ? act.stage === "Vanaheim" : stage === "Vanaheim") {
        color = "accent_blue";
        runeUrl = "vanaheim.svg";
      } else {
        color = "accent_yellow";
        runeUrl = "jotunheim.svg";
      }

      if (act.logo.includes("https://")) {
        logo = act.logo;
      } else {
        logo = `https://cphrt1.herokuapp.com/logos/${act.logo}`;
      }

      nextActs.push({
        start: numberToTime(start),
        end: numberToTime(start + 2),
        name: act.name,
        members: act.members,
        genre: act.genre,
        logoCredits: act.logoCredits,
        logo,
        bio: act.bio,
        favorite: false,
        stage: act.stage ? act.stage : stage,
        day,
        color,
        runeUrl,
      });

      nextActs.push({
        start: numberToTime(start + 2),
        end: numberToTime(start + 4),
        name: "break",
      });
      start += 4;
    });
    return nextActs;
  }
}
module.exports = { Information };

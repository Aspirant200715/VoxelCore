import { GameEngine } from "../engine/core/GameEngine.js";
import { TestScene } from "./TestScene.js";
import { Keyboard } from "../engine/input/Keyboard.js";

Keyboard.init();

const canvas = document.getElementById("gameCanvas");
const engine = new GameEngine(canvas);

engine.setScene(new TestScene());

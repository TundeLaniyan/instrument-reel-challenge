/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {
  Instrument,
  InstrumentSymbol,
  WebSocketClientMessageJson,
  WebSocketMessage,
  WebSocketReadyState,
  WebSocketServerMessageJson,
} from "../../common-leave-me";

/**
 * Notes:
 * 
 * To subscribe or unsubscribe to/from instrument(s), send a message to the server with the following format:
 * 
 * export type WebSocketClientMessageJson =
  | {
      type: "subscribe";
      instrumentSymbols: InstrumentSymbol[];
    }
  | {
      type: "unsubscribe";
      instrumentSymbols: InstrumentSymbol[];
    };
  *
  * The server will start responding with a message with the following format:
  * 
  * export type WebSocketServerMessageJson = {
      type: "update";
      instruments: Instrument[];
    };
 */

/**
 * ❌ Please do not edit this class name
 */
export class InstrumentSocketClient {
  /**
   * ❌ Please do not edit this private property name
   */
  private _socket: WebSocket;

  /**
   * ✅ You can add more properties for the class here (if you want) 👇
   */

  private _subscriptions: Set<InstrumentSymbol> = new Set();
  private _onUpdate: (instruments: Instrument[]) => void = () => {};
  private _onError: (error: Event) => void = () => {};
  private _onClose: (event: CloseEvent) => void = () => {};

  constructor() {
    /**
     * ❌ Please do not edit this private property assignment
     */
    this._socket = new WebSocket("ws://localhost:3000/ws");

    /**
     * ✅ You can edit from here down 👇
     */

    this._socket.addEventListener("message", (event) =>
      this._handleMessage(event)
    );
    this._socket.addEventListener("error", (event) => this._onError(event));
    this._socket.addEventListener("close", (event) => this._onClose(event));
  }

  initialise(instrumentSymbols: InstrumentSymbol[]) {
    this._socket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
      this.subscribe(instrumentSymbols);
    });
  }
  private _handleMessage(event: MessageEvent) {
    const message: WebSocketServerMessageJson = JSON.parse(event.data);
    if (message.type === "update") this._onUpdate(message.instruments);
  }

  public subscribe(instrumentSymbols: InstrumentSymbol[]) {
    this._subscriptions = new Set([
      ...this._subscriptions,
      ...instrumentSymbols,
    ]);

    if (this._socket.readyState === WebSocket.OPEN) {
      this._sendSubscriptionMessage("subscribe", instrumentSymbols);
    } else {
      console.warn(
        "WebSocket is not yet open. Subscription message will be sent when the connection is established."
      );
    }
  }

  public unsubscribe(instrumentSymbols: InstrumentSymbol[]) {
    this._subscriptions = new Set(
      [...this._subscriptions].filter(
        (symbol) => !instrumentSymbols.includes(symbol)
      )
    );
    this._sendSubscriptionMessage("unsubscribe", instrumentSymbols);
  }

  private _sendSubscriptionMessage(
    type: "subscribe" | "unsubscribe",
    instrumentSymbols: InstrumentSymbol[]
  ) {
    const message: WebSocketClientMessageJson = { type, instrumentSymbols };
    this._socket.send(JSON.stringify(message));
  }

  public onUpdate(callback: (instruments: Instrument[]) => void) {
    this._onUpdate = callback;
  }

  public onError(callback: (error: Event) => void) {
    this._onError = callback;
  }

  public onClose(callback: (event: CloseEvent) => void) {
    this._onClose = callback;
  }

  public get readyState(): number {
    return this._socket.readyState;
  }

  public close() {
    this._socket.close();
  }
}

import { MraidEvent, MraidEventListener } from "./events";
import { MraidState } from "./state";
import { Anything, Url } from "./utils";
import { ExpandProperties } from "./expand";

export interface MRAIDApi {
  /**
   * @returns MRAID specification version that SDK is certified against.
   *
   * Since: 1.0
   */
  getVersion(): string;

  /**
   * Subscribe to specific event.
   * Multiple listeners can subscribe to a specific event, and a single listener can handle multiple events
   * @param event Name of event to subscribe to. One of -> "ready", "error", "stateChange", "viewableChange".
   * @param listener Function to execute when event occurs.
   *
   * Since: 1.0
   */
  addEventListener(
    event: MraidEvent | Anything,
    listener: MraidEventListener | Anything
  ): void;

  /**
   * Unsubscribe a specific handler method from a specific event.
   * Event listeners should always be removed when they are no longer useful to avoid errors.
   * If no listener function is provided, then all functions listening to the event will be removed.
   * @param event Name of event to unsubscribe from. One of -> "ready", "error", "stateChange", "viewableChange".
   * @param listener Function to be removed as callback when event occurs.
   *
   * Since: 1.0
   */
  removeEventListener(
    event: MraidEvent | Anything,
    listener: MraidEventListener | Anything
  ): void;

  /**
   * @returns Current state of the ad container. One of -> "loading", "default", "expanded", "hidden".
   * Triggered by : expand, close, or the app
   *
   * Since: 1.0
   */
  getState(): MraidState;

  /**
   *
   * @returns How the ad is displayed (inlined with content or as an interstitial overlaid content).
   * Possible values -> "inline", "interstitial"
   * The SDK returns the value of the placement to creative so that creative can behave differently as necessary.
   *
   * Since: 1.0
   */
  getPlacementType(): string;

  /**
   *
   * @returns Whether ad contained is currently on or off screen.
   * true: container is on-screen and viewable by the user;
   * false: container is offscreen and not viewable
   *
   * Since: 1.0
   */
  isViewable(): boolean;

  /**
   * The expand method will cause an existing Web View (for one-part creatives) or
   * a new Web View (for two-part creatives) to open at the highest z-order in the view hierarchy.
   * When the expand method is called without the URL parameter, the current web view will be reused,
   * simplifying reporting and ad creation.
   * When the expand method is called with the URL parameter, a new web view will be used.
   *
   * Since: 1.0
   */
  expand(url?: Url | Anything): void;

  /**
   * @returns Current ExpandProperties object
   *
   * Since: 1.0
   */
  getExpandProperties(): ExpandProperties;

  /**
   * Sets whole ExpandProperties object
   * @param properties to set
   *
   * Since: 1.0
   */
  setExpandProperties(properties?: ExpandProperties | Anything): void;

  /**
   * The close method will cause the ad webview to downgrade its state.
   * For ads in an expanded state, the close() method moves to a default state.
   * For ads in a default state, the close() method moves to a hidden state.
   *
   * Since: 1.0
   */
  close(): void;

  /**
   * Signals the SDK to stop using the default close indicator
   * @param useCustomClose
   * true – ad creative supplies its own designs for the close area
   * false – SDK default image should be displayed for the close area
   *
   * Since: 1.0
   */
  useCustomClose(useCustomClose: boolean): void;

  /**
   * The open method will display an embedded browser window in the application that loads an
   * external URL. On device platforms that do not allow an embedded browser, the open method
   * invokes the native browser with the external URL.
   * @param url The URL of the web page
   *
   * Since: 1.0
   */
  open(url: string | Anything): void;
}

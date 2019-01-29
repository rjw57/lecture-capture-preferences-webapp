// Get Django's CSRF token from the page from the first element named "csrfmiddlewaretoken". If no
// such element is present, the token is empty.
const CSRF_ELEMENT =
  (document.getElementsByName('csrfmiddlewaretoken')[0] as HTMLInputElement);
const CSRF_TOKEN = (typeof(CSRF_ELEMENT) !== 'undefined') ? CSRF_ELEMENT.value : '';

// Headers to send with fetch request.
const API_HEADERS = {
  'Content-Type': 'application/json',
  'X-CSRFToken': CSRF_TOKEN,
};

const API_BASE = window.location.protocol + '//' + window.location.host + '/api'

/** The various API endpoints */
export const API_ENDPOINTS = {
  preferenceList: API_BASE + '/preferences/',
  profile: API_BASE + '/profile/',
};

/**
 * A wrapper around fetch() which performs an API request. Returns a Promise which is resolved with
 * the decoded JSON body of the response (unless method is DELETE) or which is rejected in case of
 * an error.
 *
 * Any errors are *always* logged via console.error().
 */
export const apiFetch = (
  input: string | Request, init: RequestInit = {}
): Promise<any> => (
  fetch(input, {
    credentials: 'include',
    ...init,
    headers: {
      ...API_HEADERS,
      ...init.headers,
    }
  })
  .then(response => {
    if(!response || !response.ok) {
      // Always log any API errors we get.
      // tslint:disable-next-line:no-console
      console.error('API error response:', response);

      // Reject the call passing the response parsed as JSON.
      return response.json().then(body => Promise.reject({
        body,
        error: new Error('API request returned error response'),
      }))
    }

    // Parse response body as JSON (unless it was a delete).

    if (init.method === 'DELETE') {
      return null;
    }
    return response.json()
  })
  .catch(error => {
    // Always log any API errors we get.
    // tslint:disable-next-line:no-console
    console.error('API fetch error:', error);

    // Chain to the next error handler
    return Promise.reject(error);
  })
);

/**
 * Interface for a profile object returned from the API.
 */
export interface IProfile {
  is_anonymous: boolean;
  username: string;
  display_name: string;
}

/** Fetch the user's profile. */
export const profileGet = (): Promise<IProfile> => apiFetch(API_ENDPOINTS.profile);

/**
 * Interface object representing the mutable fields of a preference returned
 * from the API.
 */
export interface IPreferenceMutable {
  allow_capture: boolean;

  request_hold: boolean;
};

/**
 * Interface for a preference object returned from the API.
 */
export interface IPreference extends IPreferenceMutable {
  user: {
    username: string;
    display_name: string;
  };

  expressed_at: string;
}

/**
 * Interface for a response from the preferences list API.
 */
export interface IPreferenceListResponse {
  next?: string;
  previous?: string;
  results: IPreference[];
}

/**
 * Interface for a query fo the preferences list API.
 */
export interface IPreferenceListQuery {
  user?: string;

  ordering?: "expressed_at" | "-expressed_at";

  expressed_at_after?: string;

  expressed_at_before?: string;
}

/** Fetch a list of preferences. */
export const preferenceList = (
  query: IPreferenceListQuery = {},
  endpointUrl: string = API_ENDPOINTS.preferenceList
): Promise<IPreferenceListResponse> => apiFetch(appendQuery(endpointUrl, query));

/** Update user's preference. */
export const preferenceUpdate = (
  body: IPreferenceMutable
) : Promise<IPreference> => apiFetch(API_ENDPOINTS.preferenceList, {
  body: JSON.stringify(body),
  method: 'POST',
});

/**
 * Append to a URL's query string based on properies from the passed object.
 */
const appendQuery = (endpoint: string, o: object = {}): string => {
  const url = new URL(endpoint);
  Object.keys(o).forEach(key => {
    if(o[key] !== undefined) { url.searchParams.append(key, o[key]); }
  });
  return url.href;
}

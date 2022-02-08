export function define(str) {
    const REQUEST = `${str}_REQUEST`;
    const SUCCESS = `${str}_SUCCESS`;
    const FAIL = `${str}_FAIL`;

    function request(cb, payload = {}, takeLatest = false) {
        return {
            cb,
            payload,
            request: on.request,
            fail: on.fail,
            success: on.success,
            _takeLatest: takeLatest,
            takeLatest() {
                this._takeLatest = true;
                return this;
            },
            onRequest(p) {
                this.request = p;
                return this;
            },
            onFail(p) {
                this.fail = p;
                return this;
            },
            onSuccess(p) {
                this.success = p;
                return this;
            },
            REQUEST,
            SUCCESS,
            FAIL,
        };
    }

    return {
        REQUEST,
        SUCCESS,
        FAIL,
        request,
    };
}

let events = [];

function addEvent(action) {
    events.push(action.REQUEST);
}

function getEvent(action) {
    return events.find((e) => e === action.REQUEST);
}

function removeEvent(action) {
    events = events.filter((e) => e !== action.REQUEST);
}

function createRequestMiddleware() {
    return ({ dispatch, getState }) => (next) => async (action) => {
        if (action.REQUEST) {
            const args = { dispatch, getState };
            dispatch({
                type: action.REQUEST,
                payload: action.request(action.payload, args) || on.request(action.payload, args) || action.payload,
                status: 'request',
            });
            addEvent(action);
            try {
                const response = await action.cb(args);
                removeEvent(action);

                if (action._takeLatest && getEvent(action)) {
                    return null;
                }
                return dispatch({
                    type: action.SUCCESS,
                    payload: action.success(response, args) || on.success(response, args) || response,
                    status: 'ok',
                });
            } catch (error) {
                removeEvent(action);
                if (action._takeLatest && getEvent(action)) {
                    return null;
                }
                return dispatch({
                    type: action.FAIL,
                    payload: action.fail(error, args) || on.fail(error, args) || error,
                    status: 'error',
                });
            }
        }

        return next(action);
    };
}

export const on = {
    request: (payload) => payload,
    success: (payload) => payload,
    fail: (payload) => payload,
};

export const requestMiddleware = createRequestMiddleware();
requestMiddleware.on = on;

/**
 * PostMessage Utilities for MFE → Portal Communication
 * Provides secure message handling for embedded apps receiving data from the Portal
 */

// Message types from Portal
export type PortalMessageType = 'AUTH_DATA' | 'PORTAL_READY';

// Message types to Portal
export type MFEMessageType = 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'MFE_READY';

export interface PortalAuthMessage {
    type: 'AUTH_DATA';
    payload: {
        userId: string;
        userName: string;
        userEmail: string;
        userRole: string;
        userGender?: 'M' | 'F';
    };
    timestamp: number;
}

export interface PortalReadyMessage {
    type: 'PORTAL_READY';
    timestamp: number;
}

export interface MFEAuthSuccessMessage {
    type: 'AUTH_SUCCESS';
    timestamp: number;
}

export interface MFEAuthFailureMessage {
    type: 'AUTH_FAILURE';
    error: string;
    timestamp: number;
}

export interface MFEReadyMessage {
    type: 'MFE_READY';
    timestamp: number;
}

export type PortalMessage = PortalAuthMessage | PortalReadyMessage;
export type MFEMessage = MFEAuthSuccessMessage | MFEAuthFailureMessage | MFEReadyMessage;

// Allowed portal origins for security validation
const ALLOWED_PORTAL_ORIGINS = [
    'http://localhost:3000', // Local development Portal
    'http://localhost:5173', // Vite dev server Portal
    'https://portal-tarsila.vercel.app', // Production Portal (adjust as needed)
    // Add other portal origins as needed
];

/**
 * Validates if a message origin is from an allowed portal
 */
export const isAllowedPortalOrigin = (origin: string): boolean => {
    const isAllowed = ALLOWED_PORTAL_ORIGINS.includes(origin);

    if (!isAllowed) {
        console.warn('[MFE PostMessage] Rejected message from unauthorized origin:', origin);
        console.warn('[MFE PostMessage] Allowed origins:', ALLOWED_PORTAL_ORIGINS);
    }

    return isAllowed;
};

/**
 * Sends authentication success message to the Portal
 */
export const sendAuthSuccessToPortal = (): boolean => {
    // Only send if we're in an iframe
    if (window.self === window.top) {
        console.log('[MFE PostMessage] Not in iframe, skipping AUTH_SUCCESS message');
        return false;
    }

    const message: MFEAuthSuccessMessage = {
        type: 'AUTH_SUCCESS',
        timestamp: Date.now(),
    };

    try {
        // Send to parent window (Portal)
        window.parent.postMessage(message, '*'); // We'll validate on receive, not send
        console.log('[MFE PostMessage] Sent AUTH_SUCCESS to Portal');
        return true;
    } catch (error) {
        console.error('[MFE PostMessage] Error sending AUTH_SUCCESS:', error);
        return false;
    }
};

/**
 * Sends authentication failure message to the Portal
 */
export const sendAuthFailureToPortal = (error: string): boolean => {
    // Only send if we're in an iframe
    if (window.self === window.top) {
        console.log('[MFE PostMessage] Not in iframe, skipping AUTH_FAILURE message');
        return false;
    }

    const message: MFEAuthFailureMessage = {
        type: 'AUTH_FAILURE',
        error,
        timestamp: Date.now(),
    };

    try {
        window.parent.postMessage(message, '*');
        console.error('[MFE PostMessage] Sent AUTH_FAILURE to Portal:', error);
        return true;
    } catch (err) {
        console.error('[MFE PostMessage] Error sending AUTH_FAILURE:', err);
        return false;
    }
};

/**
 * Sends ready signal to the Portal
 */
export const sendMFEReadyToPortal = (): boolean => {
    // Only send if we're in an iframe
    if (window.self === window.top) {
        console.log('[MFE PostMessage] Not in iframe, skipping MFE_READY message');
        return false;
    }

    const message: MFEReadyMessage = {
        type: 'MFE_READY',
        timestamp: Date.now(),
    };

    try {
        window.parent.postMessage(message, '*');
        console.log('[MFE PostMessage] Sent MFE_READY to Portal');
        return true;
    } catch (error) {
        console.error('[MFE PostMessage] Error sending MFE_READY:', error);
        return false;
    }
};

/**
 * Creates a message listener for Portal messages
 */
export const createPortalMessageListener = (
    onAuthData?: (authData: PortalAuthMessage['payload']) => void,
    onPortalReady?: () => void
): ((event: MessageEvent) => void) => {
    return (event: MessageEvent) => {
        // Validate origin
        if (!isAllowedPortalOrigin(event.origin)) {
            // Log but don't spam console for every unrelated message
            return;
        }

        const message = event.data as PortalMessage;

        // Validate message structure
        if (!message || !message.type) {
            console.warn('[MFE PostMessage] Received invalid message format from Portal');
            return;
        }

        console.log('[MFE PostMessage] Received message from Portal:', {
            type: message.type,
            origin: event.origin,
            timestamp: new Date().toISOString(),
        });

        switch (message.type) {
            case 'AUTH_DATA':
                console.log('[MFE PostMessage] Received AUTH_DATA:', {
                    userId: message.payload.userId,
                    userName: message.payload.userName,
                    userEmail: message.payload.userEmail,
                    userRole: message.payload.userRole,
                });
                onAuthData?.(message.payload);
                break;

            case 'PORTAL_READY':
                console.log('[MFE PostMessage] Portal is ready');
                onPortalReady?.();
                break;

            default:
                console.warn('[MFE PostMessage] Unknown message type:', message);
        }
    };
};

/**
 * Checks if the app is running inside an iframe
 */
export const isInIframe = (): boolean => {
    return window.self !== window.top;
};

/**
 * Logs diagnostic information about the iframe context
 */
export const logIframeContext = (): void => {
    const inIframe = isInIframe();

    console.log('[MFE PostMessage] Iframe Context:', {
        inIframe,
        currentUrl: window.location.href,
        referrer: document.referrer,
        parentAccessible: inIframe ? 'Checking...' : 'N/A',
    });

    if (inIframe) {
        try {
            // Try to access parent - this will fail if different origin (CORS)
            const parentUrl = window.parent.location.href;
            console.log('[MFE PostMessage] Parent URL accessible:', parentUrl);
        } catch (e) {
            console.log('[MFE PostMessage] Parent URL not accessible (different origin - expected for security)');
        }
    }
};

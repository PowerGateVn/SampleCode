
export const grantType = {
    password : 'password',
    refreshToken: 'refresh_token',
    magicLink: 'magic_link'
};
export const deeplinkUrl = {
    forgotPassword : '/forgot-password',
    magicLink : '/magic-link'
};
export const expiresLogin = {
    // 12 hour
    // => ms
    default : 12 * 60 * 60 * 1000
};
export const dbType = {
    firestore: 'firestore'
};
export const localstorageName = {
    authInfo: 'auth_info',
    firebaseToken: 'firebase_token',
};

export const okrsByStatusObject = {
    notStarted: {
        key: 0,
        name: 'Not started',
        color: '#e6edf5',
        order: 5
    },
    onTrack: {
        key: 1,
        name: 'On track',
        color: '#63CD00',
        order: 2
    },
    behind: {
        key: 2,
        name: 'Behind',
        color: '#FEAC41',
        order: 1
    },
    atRisk: {
        key: 3,
        name: 'At risk',
        color: '#EF6E6E',
        order: 0
    },
    done: {
        key: 4,
        name: 'Done',
        color: '#899AAb',
        order: 3
    },
    postponed: {
        key: 5,
        name: 'Postponed',
        color: '#328df4',
        order: 4
    }
};

export const entityType = {
    users: 'users',
    teams: 'teams',
    organizations: 'organizations'
};

export const typeObjective = {
    individual: 'Individual',
    company: 'Company',
    team: 'Team'
};

export const indicatorObjective = {
    color: {
        red: 'red',
        orange: 'orange'
    },
    colorMess: {
        danger: 'danger',
        warning: 'warning',
        normal: 'normal',
        normalDanger: 'normal-danger'
    }
};
export const okrScoreType = {
    danger: {
        maxValue: 0.4,
        color: '#EF6E6E'
    },
    warning: {
        maxValue: 0.6,
        color: '#FEAC41',
    },
    defaults: {
        maxValue: 0.9,
        color: '#63CD00',
    },
    complete: {
        maxValue: 1.0,
        color: '#feac41',
    },
    noScore: {
        color: '#888888',
    },
};

export const userStatus =  {
    inactive: 'inactive',
    userInactive: 'user_inactive'
};

export const buttonBackLink = {
    default: 'My OKRs'
};

export const metricType = {
    type: 'kpi'
};

export const keyActivities = {
    create: 'objective.create',
    update: 'objective.update',
    align: 'objective.align',
    checkIn: 'objective.check_in',
    complete: 'objective.complete',
    comment: 'objective.comment'
};

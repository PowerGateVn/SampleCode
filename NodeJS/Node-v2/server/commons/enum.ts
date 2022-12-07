export default {
  // InAppEvent
  termsAndConditionsLastUpdated: '2018-12-11 03:52:07.286+00',
  eventCategory: {
    User: 0,
    Admin: 1
  },
  payoutType: {
    VoidPayout: 0,
    PayCharger: 1
  },
  eventType: {
    Login: 0,
    Unlock: 1,
    Lock: 2,
    StartUp: 3,
    VehicleIdentification: 4,
    LocationServices: 5,
    RideFlow: 6,
    PaymentDetailsAddAttempt: 7,
    PaymentDetailsAddFail: 8,
    PaymentDetailsUpdateAttempt: 9,
    PaymentDetailsUpdateFail: 10,
    Authentication: 11,
    CustomerSupport: 12,
    ChargerCollectFlow: 13,
    ChargerInPossession: 14,
    ChargerDeployFlow: 15,
    ChargerPayouts: 16,
    AdminCollectFlow: 17,
    AdminDeployFlow: 18,
    AdminAddScooterFlow: 19
  },

  VehicleEventName: {
    vehicleFound: 'vehicleFound'
  },

  locationType: {
    MobilePhone: 0,
    AssetTrackerDailyHeartbeat: 1,
    TrackerInMotion: 2,
    TrackerAfterMotionSingleReport: 3,
    Latest: 4,
    Best: 5,
    NinebotOmniIotLocation: 6
  },

  // Trip
  tripStatus: {
    Started: 0,
    Completed: 1,
    Disconnected: 2,
    Unknown: 3,
    Cancelled: 4
  },

  tripVehicleLockStatus: {
    LockedBeforeIot: 10,
    IotLockCommandSkipped: 11,
    IotLockCommandSent: 12,
    IotLockFailed: 13,
    LockedAfterIot: 14,
    LockedViaHeartbeat: 15
  },

  // Trip
  // TODO: (BT-1344)This should be renamed to paymentStatus
  tripPaid: {
    Paid: 0,
    UnPaid: 1,
    Refund: 2, // Cash + credits(if any)
    PendingRefund: 3,
    Error: 4,
    FullyCreditsRefund: 5,
    InProgress: 6
  },

  // This object is used by migration: n10-modify-vehiclessettings-geofence-fine
  endTripOutsideOfGeofenceBehavior: Object.freeze({
    allowed: 'ALLOWED',
    allowedWithFine: 'ALLOWED_WITH_FINE',
    notAllowed: 'NOT_ALLOWED'
  }),

  /**
   * different modes of end trip inside geofences behaviors.
   * - allowed: No penalty or preventative actions for ending trip inside geofence.
   * - allowedWithFine: allowed but user need to pay some fee.
   * - notAllowed: user cannot end trip inside geofence.
   */
  endTripInsideGeoRegionBehavior: Object.freeze({
    allowed: 'ALLOWED',
    allowedWithFine: 'ALLOWED_WITH_FINE',
    notAllowed: 'NOT_ALLOWED'
  }),

  adyenStatus: {
    authorised: 'Authorised'
  },

  // User
  userType: {
    Rider: 0,
    Staff: 1,
    Admin: 2,
    Charger: 3
  },

  // Vehicle
  vehicleType: {
    Scooter: 0,
    OmniIot: 1
  },

  vehicleChargeStatus: {
    Charging: 0,
    Done: 1,
    DoneByAdmin: 2
  },

  fineType: {
    GeoFence: 'GeoFence'
  },

  tripEndBy: {
    user: 0,
    scheduledJob: 1
  },

  vehicleStatus: {
    AvailableToRide: 0,
    AvailableToRideBatteryUnder15: 1,
    RideInProgress: 2,
    ChargeInProgress: 3,
    Broken: 4,
    InMaintenance: 5,
    UnAvailableToRide: 6
  },
  vehicleUpdateStatus: {
    IsStartTrip: 0,
    IsOnTrip: 1,
    IsUnpaid: 2,
    IsEndTripUnPaid: 3,
    IsEndTripByOperation: 4,
    IsInMotion: 5,
    IsInCollect: 6,
    IsInDeploy: 7
  },
  vehicleAction: {
    Ride: 0,
    TakeOff: 1,
    DropOff: 2,
    Collect: 3,
    Deploy: 4,
    AdminUnlock: 5,
    AdminLock: 6,
    AdminApplyLocalSetting: 7,
    AdminEndTrip: 8
  },

  vehicleModelName: {
    NinebotES2: 'Ninebot ES2',
    NinebotES4: 'Ninebot ES4',
    NinebotModelMax: 'NINEBOT_MODEL_MAX'
  },

  deviceOS: {
    IOS: 0,
    Android: 1,
    Other: 2
  },

  RangerOfNotUse: {
    firstNotUse: 36,
    SecondNotUse: 72
  },

  collectionType: {
    collectByAdmin: 0,
    collectByCharger: 1,
    deployed: 2
  },

  // Setting params
  settingParams: {
    MaximumSearchRadius: 'MaximumSearchRadius',
    MaximumSearchRadiusCharger: 'MaximumSearchRadiusCharger',
    MaximumScootersDisplayed: 'MaximumScootersDisplayed',
    BasePrice: 'BasePrice',
    PricePerAdditionalMinute: 'PricePerAdditionalMinute',
    MinimumBatteryPercentage: 'MinimumBatteryPercentage',
    EnableChargerFeature: 'EnableChargerFeature',
    MaximumBattery: 'MaximumBattery',
    AllowedDropoffProximity: 'AllowedDropoffProximity',
    DefaultMaxCollectedScooters: 'DefaultMaxCollectedScooters',
    DefaultBounty: 'DefaultBounty',
    // propery for determine the time for first jump of bounty price
    // if not available, fallback to old configured value, i.e. 36
    InitialBountyTierHoursCutoff: 'InitialBountyTierHoursCutoff',
    // property for determine the time for second jump of bounty price
    // if not available, fallback to old configured value, i.e. 72
    MidBountyTierHoursCutoff: 'MidBountyTierHoursCutoff',
    BountyForScooterNotUsedIn3672Hours: 'BountyForScooterNotUsedIn3672Hours',
    BountyForScooterNotUsedIn72Hours: 'BountyForScooterNotUsedIn72Hours',
    MinimumNumberOfRequiredScooters: 'MinimumNumberOfRequiredScooters',
    DaysOfWeek: 'DaysOfWeek',
    MinimumAllowableBatteryCharge: 'MinimumAllowableBatteryCharge',
    ChargerLatestDropOffTime: 'ChargerLastestDropOffTime',
    ChargerEarliestDropOffTime: 'ChargerEarliestDropOffTime',
    RequestReviewApp: 'RequestReviewApp',
    Currency: 'Currency',
    DecimalPoints: 'DecimalPoints',
    symbol: 'Currency',
    ChargerEarliestPickUpTime: 'ChargerEarliestPickUpTime',
    ChargerLatestPickUpTime: 'ChargerLatestPickUpTime',
    TimeZone: 'TimeZone',
    SignupCreditsAward: 'SignupCreditsAward',
    showVehiclesOutsideOperatingGeofences:
      'showVehiclesOutsideOperatingGeofences'
  },

  eventCode: {
    cancelOrRefund: 'CANCEL_OR_REFUND',
    refund: 'REFUND'
  },

  accountType: {
    admin: 0,
    Staff: 1
  },

  geoName: {
    Singapore: 'Singapore',
    Global: 'Global',
    Hanoi: 'Hanoi',
    Malaysia: 'Malaysia',
    Vietnam: 'Vietnam'
  },

  geoRegionType: {
    Global: 'Global',
    Country: 'Country',
    City: 'City',
    GeoFence: 'GeoFence'
  },

  credits: {
    refundStatus: {
      CREDITS_PART_REFUND: 'CREDITS_PART_REFUND',
      FULLY_CREDITS_REFUND: 'FULLY_CREDITS_REFUND',
      SIGNUP_CREDITS: 'SIGNUP_CREDITS',
      PROMO_CODE_CREDITS: 'PROMO_CODE_CREDITS',
      REFERRAL_CREDITS: 'REFERRAL_CREDITS',
      FINE_CREDITS_PART_REFUND: 'FINE_CREDITS_PART_REFUND',
      FINE_FULLY_CREDITS_REFUND: 'FINE_FULLY_CREDITS_REFUND'
    },
    reason: {
      EMPLOYEE_BENEFIT: 'EMPLOYEE_BENEFIT',
      TRIP_REFUND: 'TRIP_REFUND',
      WONDERFUL_USER_REWARD: 'WONDERFUL_USER_REWARD',
      GREAT_PARKING: 'GREAT_PARKING',
      BRAND_AMBASSADOR: 'BRAND_AMBASSADOR',
      PROMO_CODE_CREDITS: 'PROMO_CODE_CREDITS'
    }
  },
  transactionType: {
    PAYMENT: 'PAYMENT',
    FINE_PAYMENT: 'FINE_PAYMENT'
  },

  roles: {
    USER_RIDER: 'user-rider',
    USER_STAFF: 'user-staff',
    USER_ADMIN: 'user-admin',
    USER_CHARGER: 'user-charger',
    ACCOUNT_ADMIN: 'admin-admin',
    ACCOUNT_STAFF: 'admin-staff'
  },

  locationReportTypes: {
    lastReportedTrackerStatic: 'lastReportedTrackerStatic',
    lastReportedTrackerMotion: 'lastReportedTrackerMotion',
    lastReportedPhone: 'lastReportedPhone',
    lastReportedOmniIoT: 'lastReportedOmniIoT',
    lastReportedTrackerAfterMotionSingleReport:
      'lastReportedTrackerAfterMotionSingleReport'
  },

  chargerRole: {
    add: 1,
    remove: 2
  },

  systemSettingType: {
    create: 'Create',
    update: 'Update'
  },

  typeForGetGeoRegion: {
    geofence: 'GeoFence'
  },

  referralCodeAwardType: {
    creditsForPersonReferring: 'creditsForPersonReferring',
    creditsForPersonBeingReferred: 'creditsForPersonBeingReferred'
  },

  nonCreditTransactionStatus: {
    rejected: 'REJECTED',
    authorized: 'AUTHORIZED'
  },

  webhookNotificationEventCode: {
    authorisation: 'AUTHORISATION'
  },

  searchType: {
    byId: 1,
    byPhoneNumber: 2,
    byEmail: 3
  },

  omniIot: {
    alarmType: {
      illegalMoving: 1,
      falling: 2,
      illegalDisassemble: 3
    },
    voicePrompt: {
      geofence: 1,
      scooterSearch: 2,
      lowBattery: 3,
      illegalMoving: 4,
      genericLoud: 5
    }
  },

  adminActions: {
    vehicle: {
      lock: 'LOCK_VEHICLE',
      unlock: 'UNLOCK_VEHICLE',
      release: 'RELEASE_VEHICLE',
      collect: 'COLLECT_VEHICLE'
    }
  },
  tripInvoice: Object.freeze({
    type: {
      UX_B2B: 1
    },
    status: {
      SUCCESS_SUBMIT: 1,
      FAIL_SUBMIT: 2,
      SUCCESS_CANCELLED: 3,
      FAIL_CANCEL: 4
    }
  }),
  iotUpgradeState: {
    notApplicable: 'NOT_APPLICABLE',
    unknown: 'UNKNOWN',
    needUpgrade: 'NEED_UPGRADE',
    upgrading: 'UPGRADING',
    fullyUpgraded: 'FULLY_UPGRADED'
  }
};

import commons from './enum';
export default {
  // InAppEvent
  inAppEvent: {},

  generalMessage: {
    Error: 'There was some error'
  },

  // RiderPaymentMethod
  riderPaymentMethod: {
    ErrorRetrievingPaymentDetails:
      'There was an error in retrieving the payment details',
    ErrorDisablingRecurringPayment:
      'There was an error disabling the recurring payment'
  },

  adyenResultCode: {
    Authorised: 'The payment authorisation was successfully completed.',
    Refused: 'The payment was refused.',
    RedirectShopper:
      'IThe shopper will be redirected to an external web page or app to complete the authorisation.',
    Received:
      'The payment has successfully been received and will be processed.',
    Cancelled:
      'The payment has been cancelled (either by the shopper or the merchant) before processing was completed.',
    Pending:
      'It is not possible to obtain the final status of the payment. This final status information for the payment is unavailable, or the user may need to take further action to complete the payment.',
    Error:
      'An error occurred during processing of the payment. The reason is given in the refusalReason field. This is a final state.'
  },

  payout: {
    UserNotFound: 'User not found',
    ReferenceExist: 'This reference number already exists',
    PayoutNotAllowed:
      'You are only allowed to pay chargers in the currency associated with their charger signup country',
    UserIsNotCharger: 'This user is not a charger'
  },

  // Trip
  trip: {
    UserNotFound: 'We did not find a user with this user id',
    RefundUserNotFound: 'We did not find a user with this user id',
    allowStartTripInsideGeofence:
      'This Beam is not within our operating area and will be picked up by our staff shortly',
    RefundTripNotFound:
      'We did not find this trip id based on the entered user id',
    RefundTripIdAndUserIdNotMatch:
      'We did not find this trip id based on the entered user id',
    NoTripUpdated: 'Does not find the trip for update',
    NotFound: 'Trip does not exist',
    ErrorHappened: 'Error happen when add new trip',
    VehicleNotFound: 'Does not find vehicle for trip',
    success: 'success',
    unPaid:
      'Your last trip was unpaid due to your cards expiration or cancellation. Please add a new payment method',
    NotFoundLastAuthorise: 'not found last authorise',
    Error: 'some thing went wrong',
    TripAlreadyEnded: 'Trip already ended',
    TripInPayment: 'Trip already in payment',
    TripHasNotEnded: 'This trip has not ended. Please end the trip first.',
    TripAlreadyRefund:
      'This trip was already refunded or the refund is processing.',
    TripNotFoundForId: tripId => {
      return `Trip not found for trip Id: ${tripId}`;
    },
    TripNotMatchUserId:
      'We did not find this trip id based on the entered user id',
    TripCanNotRefund: (status, tripPaid) => {
      return `tripStatus: ${status} and tripPaid: ${tripPaid} this trip can not refund with Error`;
    },
    FineCannotRefund: paymentStatus => {
      return `The fine could not be refunded, the status of the fine is ${paymentStatus}`;
    },
    RefundFineNotFound: `We did not find a fine based on the entered trip id`,
    TripStartSuccess: 'Trip start success',
    InProcess: 'Trip In Process',
    TripNotUpdate: 'Trip can not Update',
    UnableToPayWithCredit: 'Error when paying with credits',
    FareAmountIsSmallerThanPaidAmount:
      'Fare amount is smaller than paid amount calculateAmountUnpaidInCents',
    TripOnUnrideablePeriod: (start, end) => {
      return `Due to security considerations, we only provide riding service from ${start} to ${end}. Thanks for your understanding.`;
    },
    TripAlreadyPaid: 'Trip is already paid',
    illegalParkingCode: 'illegal parking'
  },

  geoRegion: {
    NotFound: 'Can not find Your location',
    VehicleSettingsNoFound: 'Can not find vehicle settings for this location',
    VehicleSettingsError: 'Property "VehiclesSetting" does not exist'
  },

  // User
  user: {
    UserNotFound: 'User not found',
    UserNotFoundWith: searchTerm => {
      return `We did not find a matching user with that ${searchTerm}`;
    },
    UserNotFoundWithId:
      'There is no user with this user id & currency in our system',
    JwtAccessToken: token => {
      return `JWT ${token}`;
    },
    EmailExisted: email => {
      return `This email address is already associated with another Beam account. \n \n Please enter another email address`;
    },
    success: 'success',
    UserNotFoundWithPhoneNumberAndCountryCode:
      'Can not find user with PhoneNumber and CountryCode',
    UserCountryNotMatchPhoneNumber:
      'This users country does not match their phone number',
    UserAlreadyCharger: 'This user is already enabled as a charger.',
    addCharger: 'add Charger Successfully',
    removeCharger: 'remove Charger Successfully',
    UserIsNotCharger: 'This user is not registered as a charger.'
  },

  keyValue: {
    Success: 'Update Successfully',
    NotFound: 'KeyValue NotFound'
  },

  account: {
    success: 'success',
    failed: 'Username or password is incorrect'
  },

  phoneVerify: {
    success: 'verify successfully',
    errorMissing: 'Missing fields'
  },

  charge: {
    VehicleNotFound: 'Vehicle not found',
    MaxBattery:
      'This Beam is not on the charger map because it’s battery level is not below the threshold required for collection.',
    MinBattery: 'Battery percent is less than minimum',
    MaxScooter: 'Reach Max Collected Scooters',
    CreateError: 'Unexpected error',
    AllowedDropoffProximity:
      'You’re too far from a valid release location to release this charges scooter.',
    VehicleChargeNotFound: 'Vehicle charge not found',
    NoVehicleForDropOff:
      'You need to collect some Beams to charge before you can release',
    pinFull:
      'This release location already has too many scooters. Please try another nearby one',
    NotFoundDropOffHistory: 'You have no Drop off',
    LateDropOff:
      'It’s currently after the allowed drop-off time which can result in a deduction in pay',
    EarlyDropOff:
      'You are attempting to drop off the Beam before the earliest allowed dropoff time.',
    EarlyDropOffTitle: 'Outside Dropoff Window',
    FarDropOff:
      'This Beam is not close enough to a specified dropoff range. Deploying here can result in a deduction in pay',
    LateDropOffTitle: 'Attempted late drop-off',
    FarDropOffTitle: 'Not Near Dropoff Zone',
    AvailableTime:
      'You are attempting to pick up a Beam outside of the allowed charger pickup times',
    PickupNotAllowed:
      'You are only allowed to charge vehicles in the country you signed up in',
    TakeOffBeforeEarliest: earliest => {
      return `This Beam is not yet available for charger pickup. Please wait until ${earliest}.`;
    }
  },
  // Vehicle
  vehicle: {
    Forbidden: 'You do not have access to this function',
    CodeNotFound: 'Vehicle not found with the given Code',
    ExistingVehicle: field => {
      const fieldName = Object.keys(field)[0];
      let message = '';
      switch (fieldName) {
        case 'serialNumber': {
          message = `Scooter Serial : ${field.serialNumber}`;
          break;
        }
        case 'assetTrackerId': {
          message = `Tracker Serial : ${field.assetTrackerId}`;
          break;
        }
        default:
          message = `QR code : ${field.code}`;
      }
      return `Duplicate Entry. The following values already exist in the database ${message}`;
    },
    MissingInformation: missInfo => {
      return `Missing required information: ${missInfo}`;
    },
    NotFound: 'Vehicle does not exist',
    notFoundInCharging: 'Vehicle not found in charging',
    RegistrationSuccess: 'Registration Success',
    RegistrationUnsuccess: 'Registration Unsuccess',
    UpdateError: 'Can not update Vehicles',
    UpdateAssetTracker: 'Update Successful',
    ignoreData: 'ignore all this data',
    AssetTrackerNotFound: 'Device not found in database',
    UpdateSuccess: 'Update Successful',
    AccessDenied: 'Access Denied',
    Success: 'success',
    CanNotRide: 'The vehicle is already collected, Please find another nearby',
    InProcess: 'Vehicle Inprocess',
    UnAvailable:
      'This vehicle is currently in need of maintenance and cannot be ridden',
    vehicleMinimumBattery:
      'You can not start this Beam because its battery is too low.',
    InvalidAction: 'Invalid action',
    RequireForceCollect: 'Please force collect the vehicle first',
    TitleForUnAvailable: 'Vehicle unavailable',
    ActionNotAllow: 'This Beam is currently on a trip',
    CanNotVerifyVehicle: (action, status) => {
      let message;
      if (action === commons.vehicleAction.Ride) {
        message = 'This Beam is in use - check the map for another Beam nearby';
      }
      if (
        action === commons.vehicleAction.TakeOff ||
        action === commons.vehicleAction.Collect
      ) {
        message =
          'This vehicle is already in possession by another charger or Beam admin';
      }
      if (
        action === commons.vehicleAction.DropOff ||
        action === commons.vehicleAction.Deploy
      ) {
        message =
          'You need to collect some Beams to charge before you can release';
      }
      if (
        (action === commons.vehicleAction.TakeOff ||
          action === commons.vehicleAction.Collect) &&
        status === commons.vehicleStatus.RideInProgress
      ) {
        message =
          'You are unable to collect a vehicle that is currently on a trip';
      }

      return message;
    },
    CanNotVerifyVehicleCode: (action, status) => {
      let messageCode;

      if (
        action === commons.vehicleAction.AdminEndTrip &&
        status !== commons.vehicleStatus.RideInProgress
      ) {
        messageCode = 'admin.end_trip_error.ride_not_in_progress';
      }

      return messageCode;
    }
  },

  setting: {
    NotFound: 'Setting Not found'
  },

  // VehicleDamage
  vehicleDamage: {},

  error: {
    Error: 'Error'
  },

  // PromoCode
  promoCode: {
    create: 'create',
    update: 'update',
    success: 'Success',
    createSuccess: 'Create Successfully',
    claimSuccess: 'Claim Successfully',
    missingInput:
      'Missing fields. Name, credit amount, credit currency, georegion, and number of promo codes available are required field.',
    invalidRegion: 'Invalid Georegion',
    promoCodeExist: 'Promo code already exists.',
    updateSuccess: 'Update Successfully',
    deleteSuccess: 'Delete Successfully',
    notFound: 'The promo code you entered is invalid',
    promoCodeFullyClaimed: 'The promo code you enter has fully redeemed',
    promoCodeisClaimed: 'Promo code has been redeemed',
    promoCodeForFirstTimer: 'This promo code is only for first time rider.',
    expiredPromoCode: 'This promo code has already expired'
  },

  // Referral Code
  referralCode: {
    createSuccess: 'Create Successfully',
    claimSucces: 'Claim Successfully',
    notFound: 'The referral code you entered is invalid',
    isBeingReferred: 'You have already been referred.',
    invalidGeoregion: 'Invalid Georegion',
    referralCodeForFirstTimeRider:
      'This referral code is only for first time rider.'
  },

  idealScooterLocation: {
    notFound: 'idealScooterLocation.notFound',
    outsideRadius: 'idealScooterLocation.outsideRadius',
    noAvailablePlace: 'idealScooterLocation.noAvailablePlace'
  }
};

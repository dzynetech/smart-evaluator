export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  Date: any;
  Datetime: any;
  GeoJSON: any;
  JSON: any;
  Jwt: any;
};

/** All input for the `authenticate` mutation. */
export type AuthenticateInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};

/** The output of our `authenticate` mutation. */
export type AuthenticatePayload = {
  __typename?: 'AuthenticatePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  jwt?: Maybe<Scalars['Jwt']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Boolean']>>;
};

/** All input for the `changePassword` mutation. */
export type ChangePasswordInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};

/** The output of our `changePassword` mutation. */
export type ChangePasswordPayload = {
  __typename?: 'ChangePasswordPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export enum Classification {
  Construction = 'CONSTRUCTION',
  Duplicate = 'DUPLICATE',
  NotConstruction = 'NOT_CONSTRUCTION',
  PossibleConstruction = 'POSSIBLE_CONSTRUCTION',
  Unclassified = 'UNCLASSIFIED'
}

/** A filter to be used against Classification fields. All fields are combined with a logical ‘and.’ */
export type ClassificationFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Classification>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Classification>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Classification>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Classification>;
  /** Included in the specified list. */
  in?: Maybe<Array<Classification>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Classification>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Classification>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Classification>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Classification>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Classification>>;
};

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Date']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Date']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Date']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Date']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Date']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Date']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Date']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Date']>>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Datetime']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Datetime']>>;
};

/** A filter to be used against Float fields. All fields are combined with a logical ‘and.’ */
export type FloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Float']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Float']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Float']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Float']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Float']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Float']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Float']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Float']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Float']>>;
};

/** All geometry XY types implement this interface */
export type GeometryGeometry = {
  /** Converts the object to GeoJSON */
  geojson?: Maybe<Scalars['GeoJSON']>;
  /** Spatial reference identifier (SRID) */
  srid: Scalars['Int'];
};

/** All geometry types implement this interface */
export type GeometryInterface = {
  /** Converts the object to GeoJSON */
  geojson?: Maybe<Scalars['GeoJSON']>;
  /** Spatial reference identifier (SRID) */
  srid: Scalars['Int'];
};

export type GeometryLineString = GeometryGeometry & GeometryInterface & {
  __typename?: 'GeometryLineString';
  geojson?: Maybe<Scalars['GeoJSON']>;
  points?: Maybe<Array<Maybe<GeometryPoint>>>;
  srid: Scalars['Int'];
};

export type GeometryMultiPolygon = GeometryGeometry & GeometryInterface & {
  __typename?: 'GeometryMultiPolygon';
  geojson?: Maybe<Scalars['GeoJSON']>;
  polygons?: Maybe<Array<Maybe<GeometryPolygon>>>;
  srid: Scalars['Int'];
};

export type GeometryPoint = GeometryGeometry & GeometryInterface & {
  __typename?: 'GeometryPoint';
  geojson?: Maybe<Scalars['GeoJSON']>;
  srid: Scalars['Int'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type GeometryPolygon = GeometryGeometry & GeometryInterface & {
  __typename?: 'GeometryPolygon';
  exterior?: Maybe<GeometryLineString>;
  geojson?: Maybe<Scalars['GeoJSON']>;
  interiors?: Maybe<Array<Maybe<GeometryLineString>>>;
  srid: Scalars['Int'];
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Int']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Int']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Int']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Int']>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: Maybe<Scalars['JSON']>;
  /** Contains the specified JSON. */
  contains?: Maybe<Scalars['JSON']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: Maybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: Maybe<Array<Scalars['String']>>;
  /** Contains the specified key. */
  containsKey?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['JSON']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['JSON']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['JSON']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['JSON']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['JSON']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['JSON']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['JSON']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['JSON']>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  authenticate?: Maybe<AuthenticatePayload>;
  changePassword?: Maybe<ChangePasswordPayload>;
  /** Updates a single `Permit` using a unique key and a patch. */
  updatePermit?: Maybe<UpdatePermitPayload>;
  /** Updates a single `Permit` using its globally unique id and a patch. */
  updatePermitByNodeId?: Maybe<UpdatePermitPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermitArgs = {
  input: UpdatePermitInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermitByNodeIdArgs = {
  input: UpdatePermitByNodeIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** a construction permit */
export type Permit = Node & {
  __typename?: 'Permit';
  bounds?: Maybe<GeometryMultiPolygon>;
  city?: Maybe<Scalars['String']>;
  classification: Classification;
  cost: Scalars['Float'];
  createdAt: Scalars['Datetime'];
  data?: Maybe<Scalars['JSON']>;
  formattedAddress?: Maybe<Scalars['String']>;
  geocodeData?: Maybe<Scalars['String']>;
  hasBounds?: Maybe<Scalars['Boolean']>;
  hasLocation?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  importId: Scalars['String'];
  issueDate?: Maybe<Scalars['Date']>;
  location?: Maybe<GeometryPoint>;
  locationAccuracy?: Maybe<Scalars['Float']>;
  moviegen: Scalars['Boolean'];
  moviegenRetry: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  notes: Scalars['String'];
  permitData?: Maybe<Scalars['JSON']>;
  permitDataText?: Maybe<Scalars['String']>;
  /** Reads a single `Source` that is related to this `Permit`. */
  source?: Maybe<Source>;
  sourceId?: Maybe<Scalars['Int']>;
  sqft: Scalars['Float'];
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  streetNumber: Scalars['String'];
  updatedAt: Scalars['Datetime'];
  zip?: Maybe<Scalars['String']>;
};

/** A condition to be used against `Permit` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermitCondition = {
  /** Checks for equality with the object’s `bounds` field. */
  bounds?: Maybe<Scalars['GeoJSON']>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `classification` field. */
  classification?: Maybe<Classification>;
  /** Checks for equality with the object’s `cost` field. */
  cost?: Maybe<Scalars['Float']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `data` field. */
  data?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `formattedAddress` field. */
  formattedAddress?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `geocodeData` field. */
  geocodeData?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `hasBounds` field. */
  hasBounds?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `hasLocation` field. */
  hasLocation?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `imageUrl` field. */
  imageUrl?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `importId` field. */
  importId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `issueDate` field. */
  issueDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `location` field. */
  location?: Maybe<Scalars['GeoJSON']>;
  /** Checks for equality with the object’s `locationAccuracy` field. */
  locationAccuracy?: Maybe<Scalars['Float']>;
  /** Checks for equality with the object’s `moviegen` field. */
  moviegen?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `moviegenRetry` field. */
  moviegenRetry?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `notes` field. */
  notes?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `permitData` field. */
  permitData?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `permitDataText` field. */
  permitDataText?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `sourceId` field. */
  sourceId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sqft` field. */
  sqft?: Maybe<Scalars['Float']>;
  /** Checks for equality with the object’s `state` field. */
  state?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `street` field. */
  street?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `streetNumber` field. */
  streetNumber?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `zip` field. */
  zip?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Permit` object types. All fields are combined with a logical ‘and.’ */
export type PermitFilter = {
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PermitFilter>>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `classification` field. */
  classification?: Maybe<ClassificationFilter>;
  /** Filter by the object’s `cost` field. */
  cost?: Maybe<FloatFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `data` field. */
  data?: Maybe<JsonFilter>;
  /** Filter by the object’s `formattedAddress` field. */
  formattedAddress?: Maybe<StringFilter>;
  /** Filter by the object’s `geocodeData` field. */
  geocodeData?: Maybe<StringFilter>;
  /** Filter by the object’s `hasBounds` field. */
  hasBounds?: Maybe<BooleanFilter>;
  /** Filter by the object’s `hasLocation` field. */
  hasLocation?: Maybe<BooleanFilter>;
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `imageUrl` field. */
  imageUrl?: Maybe<StringFilter>;
  /** Filter by the object’s `importId` field. */
  importId?: Maybe<StringFilter>;
  /** Filter by the object’s `issueDate` field. */
  issueDate?: Maybe<DateFilter>;
  /** Filter by the object’s `locationAccuracy` field. */
  locationAccuracy?: Maybe<FloatFilter>;
  /** Filter by the object’s `moviegen` field. */
  moviegen?: Maybe<BooleanFilter>;
  /** Filter by the object’s `moviegenRetry` field. */
  moviegenRetry?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Negates the expression. */
  not?: Maybe<PermitFilter>;
  /** Filter by the object’s `notes` field. */
  notes?: Maybe<StringFilter>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PermitFilter>>;
  /** Filter by the object’s `permitData` field. */
  permitData?: Maybe<JsonFilter>;
  /** Filter by the object’s `permitDataText` field. */
  permitDataText?: Maybe<StringFilter>;
  /** Filter by the object’s `sourceId` field. */
  sourceId?: Maybe<IntFilter>;
  /** Filter by the object’s `sqft` field. */
  sqft?: Maybe<FloatFilter>;
  /** Filter by the object’s `state` field. */
  state?: Maybe<StringFilter>;
  /** Filter by the object’s `street` field. */
  street?: Maybe<StringFilter>;
  /** Filter by the object’s `streetNumber` field. */
  streetNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `zip` field. */
  zip?: Maybe<StringFilter>;
};

/** Represents an update to a `Permit`. Fields that are set will be updated. */
export type PermitPatch = {
  bounds?: Maybe<Scalars['GeoJSON']>;
  city?: Maybe<Scalars['String']>;
  classification?: Maybe<Classification>;
  cost?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['Datetime']>;
  data?: Maybe<Scalars['JSON']>;
  formattedAddress?: Maybe<Scalars['String']>;
  geocodeData?: Maybe<Scalars['String']>;
  hasBounds?: Maybe<Scalars['Boolean']>;
  hasLocation?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  importId?: Maybe<Scalars['String']>;
  issueDate?: Maybe<Scalars['Date']>;
  location?: Maybe<Scalars['GeoJSON']>;
  locationAccuracy?: Maybe<Scalars['Float']>;
  moviegen?: Maybe<Scalars['Boolean']>;
  moviegenRetry?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  permitData?: Maybe<Scalars['JSON']>;
  permitDataText?: Maybe<Scalars['String']>;
  sourceId?: Maybe<Scalars['Int']>;
  sqft?: Maybe<Scalars['Float']>;
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  streetNumber?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Datetime']>;
  zip?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Permit` values. */
export type PermitsConnection = {
  __typename?: 'PermitsConnection';
  /** A list of edges which contains the `Permit` and cursor to aid in pagination. */
  edges: Array<PermitsEdge>;
  /** A list of `Permit` objects. */
  nodes: Array<Maybe<Permit>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Permit` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Permit` edge in the connection. */
export type PermitsEdge = {
  __typename?: 'PermitsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Permit` at the end of the edge. */
  node?: Maybe<Permit>;
};

/** Methods to use when ordering `Permit`. */
export enum PermitsOrderBy {
  BoundsAsc = 'BOUNDS_ASC',
  BoundsDesc = 'BOUNDS_DESC',
  CityAsc = 'CITY_ASC',
  CityDesc = 'CITY_DESC',
  ClassificationAsc = 'CLASSIFICATION_ASC',
  ClassificationDesc = 'CLASSIFICATION_DESC',
  CostAsc = 'COST_ASC',
  CostDesc = 'COST_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DataAsc = 'DATA_ASC',
  DataDesc = 'DATA_DESC',
  FormattedAddressAsc = 'FORMATTED_ADDRESS_ASC',
  FormattedAddressDesc = 'FORMATTED_ADDRESS_DESC',
  GeocodeDataAsc = 'GEOCODE_DATA_ASC',
  GeocodeDataDesc = 'GEOCODE_DATA_DESC',
  HasBoundsAsc = 'HAS_BOUNDS_ASC',
  HasBoundsDesc = 'HAS_BOUNDS_DESC',
  HasLocationAsc = 'HAS_LOCATION_ASC',
  HasLocationDesc = 'HAS_LOCATION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageUrlAsc = 'IMAGE_URL_ASC',
  ImageUrlDesc = 'IMAGE_URL_DESC',
  ImportIdAsc = 'IMPORT_ID_ASC',
  ImportIdDesc = 'IMPORT_ID_DESC',
  IssueDateAsc = 'ISSUE_DATE_ASC',
  IssueDateDesc = 'ISSUE_DATE_DESC',
  LocationAccuracyAsc = 'LOCATION_ACCURACY_ASC',
  LocationAccuracyDesc = 'LOCATION_ACCURACY_DESC',
  LocationAsc = 'LOCATION_ASC',
  LocationDesc = 'LOCATION_DESC',
  MoviegenAsc = 'MOVIEGEN_ASC',
  MoviegenDesc = 'MOVIEGEN_DESC',
  MoviegenRetryAsc = 'MOVIEGEN_RETRY_ASC',
  MoviegenRetryDesc = 'MOVIEGEN_RETRY_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  PermitDataAsc = 'PERMIT_DATA_ASC',
  PermitDataDesc = 'PERMIT_DATA_DESC',
  PermitDataTextAsc = 'PERMIT_DATA_TEXT_ASC',
  PermitDataTextDesc = 'PERMIT_DATA_TEXT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SourceIdAsc = 'SOURCE_ID_ASC',
  SourceIdDesc = 'SOURCE_ID_DESC',
  SqftAsc = 'SQFT_ASC',
  SqftDesc = 'SQFT_DESC',
  StateAsc = 'STATE_ASC',
  StateDesc = 'STATE_DESC',
  StreetAsc = 'STREET_ASC',
  StreetDesc = 'STREET_DESC',
  StreetNumberAsc = 'STREET_NUMBER_ASC',
  StreetNumberDesc = 'STREET_NUMBER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ZipAsc = 'ZIP_ASC',
  ZipDesc = 'ZIP_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  isAnnotator?: Maybe<Scalars['Boolean']>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  permit?: Maybe<Permit>;
  /** Reads a single `Permit` using its globally unique `ID`. */
  permitByNodeId?: Maybe<Permit>;
  /** Reads and enables pagination through a set of `Permit`. */
  permits?: Maybe<PermitsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  source?: Maybe<Source>;
  sourceByName?: Maybe<Source>;
  /** Reads a single `Source` using its globally unique `ID`. */
  sourceByNodeId?: Maybe<Source>;
  /** Reads and enables pagination through a set of `Source`. */
  sources?: Maybe<SourcesConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermitArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermitByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermitsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<PermitCondition>;
  filter?: Maybe<PermitFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<PermitsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySourceArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySourceByNameArgs = {
  name: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySourceByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySourcesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<SourceCondition>;
  filter?: Maybe<SourceFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<SourcesOrderBy>>;
};

/** The datasource permits were imported from */
export type Source = Node & {
  __typename?: 'Source';
  hasUrbanscapeVideos?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads and enables pagination through a set of `Permit`. */
  permits: PermitsConnection;
};


/** The datasource permits were imported from */
export type SourcePermitsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  before?: Maybe<Scalars['Cursor']>;
  condition?: Maybe<PermitCondition>;
  filter?: Maybe<PermitFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<PermitsOrderBy>>;
};

/** A condition to be used against `Source` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SourceCondition = {
  /** Checks for equality with the object’s `hasUrbanscapeVideos` field. */
  hasUrbanscapeVideos?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Source` object types. All fields are combined with a logical ‘and.’ */
export type SourceFilter = {
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<SourceFilter>>;
  /** Filter by the object’s `hasUrbanscapeVideos` field. */
  hasUrbanscapeVideos?: Maybe<BooleanFilter>;
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Negates the expression. */
  not?: Maybe<SourceFilter>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<SourceFilter>>;
};

/** A connection to a list of `Source` values. */
export type SourcesConnection = {
  __typename?: 'SourcesConnection';
  /** A list of edges which contains the `Source` and cursor to aid in pagination. */
  edges: Array<SourcesEdge>;
  /** A list of `Source` objects. */
  nodes: Array<Maybe<Source>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Source` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Source` edge in the connection. */
export type SourcesEdge = {
  __typename?: 'SourcesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Source` at the end of the edge. */
  node?: Maybe<Source>;
};

/** Methods to use when ordering `Source`. */
export enum SourcesOrderBy {
  HasUrbanscapeVideosAsc = 'HAS_URBANSCAPE_VIDEOS_ASC',
  HasUrbanscapeVideosDesc = 'HAS_URBANSCAPE_VIDEOS_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: Maybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<Scalars['String']>;
};

/** All input for the `updatePermitByNodeId` mutation. */
export type UpdatePermitByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Permit` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Permit` being updated. */
  patch: PermitPatch;
};

/** All input for the `updatePermit` mutation. */
export type UpdatePermitInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `Permit` being updated. */
  patch: PermitPatch;
};

/** The output of our update `Permit` mutation. */
export type UpdatePermitPayload = {
  __typename?: 'UpdatePermitPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Permit` that was updated by this mutation. */
  permit?: Maybe<Permit>;
  /** An edge for our `Permit`. May be used by Relay 1. */
  permitEdge?: Maybe<PermitsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Source` that is related to this `Permit`. */
  source?: Maybe<Source>;
};


/** The output of our update `Permit` mutation. */
export type UpdatePermitPayloadPermitEdgeArgs = {
  orderBy?: Maybe<Array<PermitsOrderBy>>;
};

export type User = Node & {
  __typename?: 'User';
  annotator?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['Datetime']>;
  id: Scalars['Int'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  urbanscape?: Maybe<Scalars['Boolean']>;
  username: Scalars['String'];
};

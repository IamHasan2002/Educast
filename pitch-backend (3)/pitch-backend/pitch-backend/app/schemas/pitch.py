from marshmallow import Schema, fields, validate

class LocationSchema(Schema):
    latitude = fields.Float(required=True)
    longitude = fields.Float(required=True)

class ReviewSchema(Schema):
    reviewer = fields.String(required=True)
    rating = fields.Integer(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.String(required=True)

class PitchCreateSchema(Schema):
    Pitch = fields.String(required=True)
    Ground = fields.String(required=True)
    location = fields.Nested(LocationSchema, required=True)
    PitchPrice = fields.Integer(required=True, validate=validate.Range(min=0))
    Status = fields.String(required=True, validate=validate.OneOf(["Open","Closed","Under Maintenance"]))
    GroundType = fields.String(required=True, validate=validate.OneOf(["Grass","Artificial Turf","Clay"]))
    Environment = fields.String(required=True, validate=validate.OneOf(["Indoor","Outdoor"]))
    Bowling_Machine = fields.String(data_key="Bowling Machine", attribute="Bowling Machine", required=True, validate=validate.OneOf(["available","not available","chargable"]))
    Reviews = fields.List(fields.Nested(ReviewSchema), data_key="Reviews")

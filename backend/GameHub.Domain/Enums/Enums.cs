namespace GameHub.Domain.Enums;

public enum UserRole
{
    SuperAdmin,
    Admin,
    Moderator,
    Customer
}

public enum GameStatus
{
    Draft,
    Published,
    Archived,
    Hidden
}

public enum OrderStatus
{
    Pending,
    Paid,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Refunded,
    Completed
}

public enum PaymentMethod
{
    Stripe,
    PayPal,
    JazzCash,
    EasyPaisa,
    GooglePay,
    ApplePay,
    BankTransfer,
    CashOnDelivery,
    Crypto
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}

public enum Platform
{
    Windows,
    macOS,
    Linux,
    PlayStation,
    Xbox,
    Nintendo,
    Android,
    iOS,
    Web
}

public enum AgeRating
{
    E = 0,
    E10 = 1,
    T = 2,
    M = 3,
    AO = 4,
    RP = 5,
    PEGI3 = 6,
    PEGI7 = 7,
    PEGI12 = 8,
    PEGI16 = 9,
    PEGI18 = 10
}

public enum DiscountType
{
    Percentage,
    FixedAmount
}

public enum NotificationType
{
    Email,
    SMS,
    Push,
    InApp
}

public enum ReviewStatus
{
    Pending,
    Approved,
    Rejected
}

public enum FileType
{
    Image,
    Video,
    Document,
    Installer,
    Archive
}

public enum Language
{
    English,
    Spanish,
    French,
    German,
    Italian,
    Portuguese,
    Russian,
    Japanese,
    Korean,
    Chinese,
    Arabic,
    Hindi
}
